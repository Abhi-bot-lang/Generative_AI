<<<<<<< HEAD
# AI Chatbot (Cohere)

A FastAPI-based AI chatbot powered by **Cohere** with PDF generation and email capabilities.

## Project Structure

```
ai-chatbot/
│
├── app.py                  # FastAPI application
├── config.py               # Environment variable loader
├── routes.py               # API endpoints
├── ai.py                   # AI integration (Cohere)
├── sessions.py             # In-memory session storage
├── pdf.py                  # PDF generation
├── email_service.py        # SMTP email sender
├── utils.py                # Helper functions
├── generated_pdfs/         # Temporary PDF files
├── .env                    # API keys and email credentials
├── requirements.txt
└── README.md
```

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Configure `.env` with your Cohere API key and email credentials:
   ```
   COHERE_API_KEY=your_cohere_api_key_here
   ```

3. Run the server:
   ```bash
   uvicorn app:app --reload
   ```

## API Endpoints

| Method   | Endpoint                      | Description                  |
|----------|-------------------------------|------------------------------|
| `GET`    | `/`                           | Health check                 |
| `POST`   | `/api/session`               | Create a new chat session    |
| `POST`   | `/api/chat`                  | Send a message to Cohere AI  |
| `GET`    | `/api/chat/history/{id}`      | Get chat history             |
| `POST`   | `/api/chat/pdf/{id}`         | Download chat as PDF         |
| `POST`   | `/api/chat/email`            | Email chat transcript        |
| `DELETE` | `/api/session/{id}`           | Delete a chat session        |
=======
# Generative_AI
>>>>>>> 33868035f77d75f771fa1bd82854f86c09623df5
