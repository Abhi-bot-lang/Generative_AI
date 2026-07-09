from fastapi import APIRouter, HTTPException, Form, UploadFile, File, Body
import shutil
import os
from datetime import datetime
from io import BytesIO
from fastapi.responses import StreamingResponse
import re


from pdf import generate_chat_pdf_bytes
from email_service import send_email, send_html_email
from html_export import generate_chat_html

from ai import generate_response
from schemas import (
    ChatRequest,
    ChatResponse,
    SessionResponse,
    FinishChatRequest,
    FinishChatResponse,
)
from sessions import (
    create_session,
    get_session,
    add_message,
    increment_count,
    message_limit_reached,
    delete_session,
)
from database import SessionLocal, engine
from sqlalchemy import text
from models import SharedChat
import secrets
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter()

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
PDF_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "generated_pdfs")
os.makedirs(PDF_OUTPUT_DIR, exist_ok=True)
MAX_PDF_SIZE_BYTES = 1 * 1024


def save_pdf_to_project(session_id: str, pdf_bytes: bytes) -> str:
    """Save a PDF inside the project-generated_pdfs folder and return its path."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"chat_{session_id}_{timestamp}.pdf"
    pdf_path = os.path.join(PDF_OUTPUT_DIR, filename)

    with open(pdf_path, "wb") as f:
        f.write(pdf_bytes)

    return pdf_path


def is_pdf_size_allowed(pdf_bytes: bytes) -> bool:
    """Return True if PDF size is within the limit, else False."""
    return len(pdf_bytes) < MAX_PDF_SIZE_BYTES


# ---------------------------------
# Create a New Chat Session
# ---------------------------------
@router.post("/start-session", response_model=SessionResponse)
def start_session():
    """
    Creates a new chat session and returns the session ID.
    """

    session_id = create_session()

    return SessionResponse(session_id=session_id)


# ---------------------------------
# Chat Endpoint
# ---------------------------------
@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    # Check if session exists
    session = get_session(request.session_id)

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid Session ID"
        )

    # Count user message
    increment_count(request.session_id)

    # Save user message
    add_message(
        session_id=request.session_id,
        role="user",
        text=request.message
    )

    # Get updated history
    session = get_session(request.session_id)
    chat_history = session["messages"]

    # Generate AI response
    ai_reply = generate_response(chat_history)

    # Save AI response
    add_message(
        session_id=request.session_id,
        role="assistant",
        text=ai_reply
    )

    # Check if limit reached after this message
    limit = message_limit_reached(request.session_id)

    return ChatResponse(
        reply=ai_reply,
        limit_reached=limit
    )


# ---------------------------------
# Create share token & persist chat
# ---------------------------------
@router.post("/share")
def create_share(session_id: str = Body(...)):
    session = get_session(session_id)

    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    # Map messages to { role, content }
    mapped = [{"role": m["role"], "content": m["text"]} for m in session.get("messages", [])]

    chat_id = secrets.token_urlsafe(16)

    # Ensure DB has recipient_email column (safe, idempotent for Postgres)
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE shared_chats ADD COLUMN IF NOT EXISTS recipient_email VARCHAR"))
            conn.commit()
    except Exception:
        # If the DB user doesn't have permission or DB is not Postgres, proceed — insert will fail later if incompatible
        pass

    db = SessionLocal()
    try:
        shared = SharedChat(chat_id=chat_id, session_id=session_id, messages=mapped)
        db.add(shared)
        db.commit()
    except SQLAlchemyError as err:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to persist shared chat")
    finally:
        db.close()

    return {"chat_id": chat_id}


# ---------------------------------
# Finish chat: generate PDF + email
# ---------------------------------
# Embeds the chat HTML directly in the email body AND attaches the PDF in all cases.
# ---------------------------------
@router.post("/finish-chat-link", response_model=FinishChatResponse)
def finish_chat_link(
    session_id: str = Form(...),
    email: str = Form(...)
):
    session = get_session(session_id)

    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    if session["count"] == 0:
        raise HTTPException(status_code=400, detail="No conversation found.")

    if session["count"] < 5:
        raise HTTPException(
            status_code=400,
            detail="You can share only after completing 5 messages."
        )

    # Basic email validation (simple regex to avoid extra deps)
    
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        raise HTTPException(status_code=400, detail="Invalid email address")

    # Generate HTML from the chat messages (always needed for large-PDF path,
    # and generating it before PDF ensures we never convert PDF→HTML)
    html_content = generate_chat_html(session["messages"])

    # Generate PDF bytes for storage and potential attachment
    pdf_bytes = generate_chat_pdf_bytes(session["messages"])
    pdf_path = save_pdf_to_project(session_id, pdf_bytes)
    chat_id = secrets.token_urlsafe(16)

    # Ensure the html_content column exists (idempotent)
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE shared_chats ADD COLUMN IF NOT EXISTS html_content TEXT"))
            conn.commit()
    except Exception:
        pass

    db = SessionLocal()
    try:
        shared = SharedChat(
            chat_id=chat_id,
            session_id=session_id,
            recipient_email=email,
            messages=[
                {"role": m["role"], "content": m["text"]}
                for m in session["messages"]
            ],
            pdf_data=pdf_bytes,
            pdf_filename=os.path.basename(pdf_path),
            html_content=html_content,
        )

        db.add(shared)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to persist shared chat")
    finally:
        db.close()

    try:
        # Embed the HTML directly in the email body AND attach the PDF unconditionally
        send_html_email(email, html_content, pdf_path)
    except Exception as e:
        import traceback
        with open("/tmp/backend_error.txt", "w") as f:
            f.write(traceback.format_exc())

        from smtplib import SMTPDataError, SMTPAuthenticationError

        if isinstance(e, SMTPDataError):
            error_text = str(e.smtp_error.decode(errors='ignore')) if isinstance(e.smtp_error, bytes) else str(e.smtp_error)
            raise HTTPException(
                status_code=502,
                detail=(
                    "Email sending failed because the SMTP provider rejected the message. "
                    f"Provider response: {e.smtp_code} {error_text}"
                )
            )

        if isinstance(e, SMTPAuthenticationError):
            raise HTTPException(
                status_code=502,
                detail="SMTP authentication failed. Check SMTP_USER and SMTP_PASSWORD."
            )

        raise HTTPException(status_code=502, detail=f"Failed to send email: {str(e)}")

    delete_session(session_id)

    return FinishChatResponse(
        success=True,
        message="Chat exported and emailed successfully.",
    )


# ---------------------------------
# Fetch shared chat by chat_id
# ---------------------------------


@router.get("/chat/{chat_id}")
def get_shared_chat(chat_id: str):
    db = SessionLocal()
    try:
        shared = db.query(SharedChat).filter(SharedChat.chat_id == chat_id).first()
        if not shared:
            raise HTTPException(status_code=404, detail="Shared chat not found")

        return {
            "chat_id": shared.chat_id,
            "messages": shared.messages,
        }
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        db.close()


@router.get("/download/{chat_id}")
def download_shared_chat_pdf(chat_id: str):
    db = SessionLocal()
    try:
        shared = db.query(SharedChat).filter(SharedChat.chat_id == chat_id).first()
        if not shared or not shared.pdf_data:
            raise HTTPException(status_code=404, detail="PDF not found")

        return StreamingResponse(
            BytesIO(shared.pdf_data),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={shared.pdf_filename or 'chat_history.pdf'}"
            }
        )
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        db.close()