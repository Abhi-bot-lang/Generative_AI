# Helper functions

import os


def cleanup_pdf(filepath: str):
    """Removes a generated PDF file after it's been sent."""
    if os.path.exists(filepath):
        os.remove(filepath)


def truncate_text(text: str, max_length: int = 500) -> str:
    """Truncates text to a maximum length with ellipsis."""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."
