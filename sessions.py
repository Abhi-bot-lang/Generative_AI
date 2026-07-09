from uuid import uuid4

# Stores all active sessions in memory
sessions = {}


def create_session():
    """
    Creates a new chat session.
    """
    session_id = str(uuid4())

    sessions[session_id] = {
        "count": 0,
        "messages": []
    }

    return session_id


def get_session(session_id: str):
    """
    Returns session data.
    """
    return sessions.get(session_id)


def add_message(session_id: str, role: str, text: str):
    """
    Adds a message to the session history.
    """
    sessions[session_id]["messages"].append(
        {
            "role": role,
            "text": text
        }
    )


def increment_count(session_id: str):
    """
    Counts only user messages.
    """
    sessions[session_id]["count"] += 1


def message_limit_reached(session_id: str):
    """
    Returns True once the session has reached the 5-message limit.
    """
    return sessions[session_id]["count"] >= 5


def delete_session(session_id: str):
    """
    Deletes a chat session.
    """
    if session_id in sessions:
        del sessions[session_id]