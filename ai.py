import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_response(chat_history):
    """
    Generates a response using Groq based on the chat history.
    """

    messages = []

    for message in chat_history:
        messages.append(
            {
                "role": message["role"],      
                "content": message["text"]
            }
        )

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=0.7,
        max_completion_tokens=500,
    )

    return response.choices[0].message.content