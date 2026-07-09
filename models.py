from sqlalchemy.sql import func
from sqlalchemy import Column, Integer, String, DateTime, LargeBinary, Text
from sqlalchemy.dialects.postgresql import JSONB
from database import Base


from database import Base

class SharedChat(Base):
    __tablename__ = "shared_chats"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(String, unique=True, index=True, nullable=False)
    session_id = Column(String, nullable=True)
    recipient_email = Column(String, nullable=True)
    messages = Column(JSONB, nullable=False)
    pdf_data = Column(LargeBinary, nullable=True)
    pdf_filename = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    html_content = Column(Text, nullable=True)

