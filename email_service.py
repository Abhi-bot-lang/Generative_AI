import os
import smtplib

from dotenv import load_dotenv
from email.message import EmailMessage

# Load environment variables
load_dotenv()

# SMTP Configuration
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

SENDER_EMAIL = os.getenv("SENDER_EMAIL")

MAX_PDF_SIZE = 1 * 1024  # 1 KB


def check_pdf_size(pdf_path: str):
    """
    Raises an exception if the PDF exceeds the allowed size.
    """

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    pdf_size = os.path.getsize(pdf_path)

    if pdf_size >= MAX_PDF_SIZE:
        raise ValueError(
            f"PDF size is {pdf_size / 1024:.2f} KB. "
            "Maximum allowed size is 1 KB."
        )


def send_email(receiver_email: str, pdf_path: str):
    """
    Sends the generated PDF to the specified email address.
    """

    if not SMTP_USER or not SMTP_PASSWORD:
        raise ValueError(
            "SMTP credentials are missing. Check your .env file."
        )

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(
            f"PDF not found: {pdf_path}"
        )

    # Check PDF size before sending (removed as per request to allow all sizes)
    # check_pdf_size(pdf_path)

    # Create email
    message = EmailMessage()

    message["Subject"] = "Your AI Chat Conversation"

    message["From"] = SENDER_EMAIL

    message["To"] = receiver_email

    message.set_content(
        """
Hello,

Thank you for using our AI Chatbot.

Your complete chat conversation is attached as a PDF.

Regards,
AI Chatbot
"""
    )

    # Attach PDF
    with open(pdf_path, "rb") as pdf_file:

        pdf_data = pdf_file.read()

        message.add_attachment(
            pdf_data,
            maintype="application",
            subtype="pdf",
            filename="chat_history.pdf"
        )

    # Send email
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(message)

        print("✅ Email sent successfully!")

    except smtplib.SMTPDataError:
        raise
    except smtplib.SMTPAuthenticationError:
        raise
    except Exception as e:
        raise RuntimeError(f"SMTP send failed: {str(e)}")


def send_html_email(receiver_email: str, html_content: str, pdf_path: str = None):
    """
    Sends the generated HTML inline in the email body, and optionally
    attaches a PDF file.
    Uses multipart/alternative with a plaintext fallback for clients
    that do not render HTML.
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        raise ValueError("SMTP credentials are missing. Check your .env file.")

    message = EmailMessage()
    message["Subject"] = "Your AI Chat Conversation"
    message["From"] = SENDER_EMAIL
    message["To"] = receiver_email

    # Set the HTML content
    message.set_content("Please enable HTML to view this message.")
    message.add_alternative(html_content, subtype='html')

    if pdf_path and os.path.exists(pdf_path):
        with open(pdf_path, "rb") as pdf_file:
            pdf_data = pdf_file.read()
            message.add_attachment(
                pdf_data,
                maintype="application",
                subtype="pdf",
                filename="chat_history.pdf"
            )

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(message)
        print("✅ HTML Email sent successfully!")
    except smtplib.SMTPDataError:
        raise
    except smtplib.SMTPAuthenticationError:
        raise
    except Exception as e:
        raise RuntimeError(f"SMTP HTML send failed: {str(e)}")