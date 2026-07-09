from pydantic import BaseModel, EmailStr, Field


class ChatRequest(BaseModel):
    session_id: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1, max_length=5000)


class ChatResponse(BaseModel):
    reply: str
    limit_reached: bool


class SessionResponse(BaseModel):
    session_id: str


class FinishChatRequest(BaseModel):
    session_id: str = Field(..., min_length=1)
    email: EmailStr


class FinishChatResponse(BaseModel):
    success: bool
    message: str