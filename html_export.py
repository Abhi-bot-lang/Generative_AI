import markdown


# ---------------------------------------------------------------------------
# Inline style constants – every element receives its styles directly.
# Gmail, Outlook, and Apple Mail all strip <style> blocks, so inline-only CSS
# is the only reliable approach for universal email rendering.
# ---------------------------------------------------------------------------

_BODY_STYLE = (
    "margin:0; padding:0;"
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"
    "background-color:#f8fafc; color:#0f172a;"
    "-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;"
)

_WRAPPER_STYLE = (
    "max-width:600px; margin:0 auto; padding:24px 16px;"
    "background-color:#f8fafc;"
)

_HEADER_STYLE = (
    "text-align:center; margin-bottom:24px; padding:20px 16px;"
    "background-color:#ffffff; border-radius:12px;"
    "border:1px solid #e2e8f0;"
)

_HEADER_H2_STYLE = (
    "margin:0; color:#1e293b; font-size:20px; font-weight:700;"
    "line-height:1.3;"
)

_ROW_STYLE = "margin-bottom:16px;"

_AVATAR_BASE = (
    "display:inline-block; width:32px; height:32px; line-height:32px;"
    "text-align:center; border-radius:8px; color:#ffffff;"
    "font-weight:bold; font-size:14px; vertical-align:top;"
)

_AVATAR_USER_STYLE = f"{_AVATAR_BASE} background-color:#334155;"
_AVATAR_AI_STYLE = f"{_AVATAR_BASE} background-color:#2563eb;"

_BUBBLE_WRAPPER_STYLE = (
    "display:inline-block; max-width:75%; vertical-align:top;"
)

_BUBBLE_BASE = (
    "padding:12px 16px; border-radius:16px;"
    "font-size:14px; line-height:1.6; text-align:left;"
)

_BUBBLE_USER_STYLE = (
    f"{_BUBBLE_BASE}"
    " background-color:#2563eb; color:#ffffff;"
    " border-top-right-radius:4px;"
)

_BUBBLE_AI_STYLE = (
    f"{_BUBBLE_BASE}"
    " background-color:#ffffff; color:#1e293b;"
    " border:1px solid #e2e8f0; border-top-left-radius:4px;"
    " box-shadow:0 1px 2px rgba(0,0,0,0.05);"
)

_FOOTER_STYLE = (
    "text-align:center; margin-top:32px; padding-top:16px;"
    "border-top:1px solid #e2e8f0;"
    "font-size:12px; color:#94a3b8; line-height:1.5;"
)

# Inline styles injected into rendered markdown elements via post-processing.
_CODE_INLINE_STYLE = (
    "background-color:#f1f5f9; color:#db2777;"
    "padding:2px 6px; border-radius:4px;"
    "font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;"
    "font-size:12px;"
)

_PRE_STYLE = (
    "background-color:#0f172a; color:#f8fafc;"
    "padding:12px; border-radius:8px; overflow-x:auto;"
    "font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;"
    "font-size:12px; line-height:1.5;"
)

_BLOCKQUOTE_STYLE = (
    "border-left:4px solid #3b82f6; margin:8px 0; padding:8px 12px;"
    "color:#475569; font-style:italic; background-color:#eff6ff;"
    "border-radius:0 4px 4px 0;"
)

_TABLE_STYLE = "border-collapse:collapse; width:100%; margin:8px 0;"
_TH_STYLE = (
    "border:1px solid #cbd5e1; padding:8px 10px; text-align:left;"
    "font-size:13px; background-color:#f1f5f9; font-weight:600;"
)
_TD_STYLE = (
    "border:1px solid #cbd5e1; padding:8px 10px; text-align:left;"
    "font-size:13px;"
)

_HR_STYLE = (
    "border:none; border-top:1px solid #e2e8f0; margin:12px 0;"
)

_P_STYLE = "margin:0 0 8px 0;"
_P_LAST_STYLE = "margin:0;"

_UL_STYLE = "margin:4px 0 8px 0; padding-left:20px;"
_OL_STYLE = "margin:4px 0 8px 0; padding-left:20px;"
_LI_STYLE = "margin-bottom:4px; font-size:14px; line-height:1.5;"

_A_STYLE = "color:#2563eb; text-decoration:underline;"

_STRONG_STYLE = "font-weight:700;"
_EM_STYLE = "font-style:italic;"


def _inline_styles(html: str, is_user_bubble: bool = False) -> str:
    """
    Post-processes rendered markdown HTML to inject inline styles on every
    element.  This is necessary because email clients strip <style> blocks
    and class/id attributes.
    """
    # Code blocks (must come before inline <code> replacement)
    html = html.replace("<pre>", f'<pre style="{_PRE_STYLE}">')
    # Inline code — inside user bubble we use a lighter style
    if is_user_bubble:
        _code_style = (
            "background-color:rgba(255,255,255,0.2); color:#ffffff;"
            "padding:2px 6px; border-radius:4px;"
            "font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;"
            "font-size:12px;"
        )
    else:
        _code_style = _CODE_INLINE_STYLE
    html = html.replace("<code>", f'<code style="{_code_style}">')

    # Block elements
    html = html.replace("<blockquote>", f'<blockquote style="{_BLOCKQUOTE_STYLE}">')
    html = html.replace("<table>", f'<table style="{_TABLE_STYLE}">')
    html = html.replace("<th>", f'<th style="{_TH_STYLE}">')
    html = html.replace("<th ", f'<th style="{_TH_STYLE}" ')
    html = html.replace("<td>", f'<td style="{_TD_STYLE}">')
    html = html.replace("<td ", f'<td style="{_TD_STYLE}" ')
    html = html.replace("<hr>", f'<hr style="{_HR_STYLE}">')
    html = html.replace("<hr/>", f'<hr style="{_HR_STYLE}">')
    html = html.replace("<hr />", f'<hr style="{_HR_STYLE}">')

    # Paragraphs
    html = html.replace("<p>", f'<p style="{_P_STYLE}">')

    # Lists
    html = html.replace("<ul>", f'<ul style="{_UL_STYLE}">')
    html = html.replace("<ol>", f'<ol style="{_OL_STYLE}">')
    html = html.replace("<li>", f'<li style="{_LI_STYLE}">')

    # Inline elements
    html = html.replace("<a ", f'<a style="{_A_STYLE}" ')
    html = html.replace("<strong>", f'<strong style="{_STRONG_STYLE}">')
    html = html.replace("<em>", f'<em style="{_EM_STYLE}">')

    # Headings inside AI responses
    for level, size in [(1, "20px"), (2, "18px"), (3, "16px"), (4, "15px"), (5, "14px"), (6, "13px")]:
        html = html.replace(
            f"<h{level}>",
            f'<h{level} style="margin:12px 0 6px 0; font-size:{size}; font-weight:700; line-height:1.3;">'
        )

    return html


def generate_chat_html(messages: list) -> str:
    """
    Converts a list of chat messages into a fully inline-styled HTML string
    suitable for embedding directly inside an email body.

    Compatible with Gmail (Web, Android, iOS), Outlook, Apple Mail, and
    Thunderbird.  Uses no <style> block, no external CSS, no JavaScript,
    and no external fonts.

    Args:
        messages: List of dicts with 'role' ('user'|'assistant') and 'text' keys.

    Returns:
        A complete HTML document string with all styles inlined.
    """
    parts: list[str] = []

    # HTML document start — minimal, no <style> block
    parts.append(
        '<!DOCTYPE html>'
        '<html lang="en">'
        '<head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
        '<title>AI Chat Conversation</title>'
        '</head>'
        f'<body style="{_BODY_STYLE}">'
        f'<div style="{_WRAPPER_STYLE}">'
    )

    # Header
    parts.append(
        f'<div style="{_HEADER_STYLE}">'
        f'<h2 style="{_HEADER_H2_STYLE}">AI Chat Conversation</h2>'
        '</div>'
    )

    # Messages
    for message in messages:
        role = message["role"]
        text = message["text"]

        # Render markdown → HTML, then inject inline styles
        rendered = markdown.markdown(text, extensions=["fenced_code", "tables"])
        is_user = role == "user"
        styled_content = _inline_styles(rendered, is_user_bubble=is_user)

        if is_user:
            parts.append(
                f'<div style="{_ROW_STYLE} text-align:right;">'
                f'<div style="{_BUBBLE_WRAPPER_STYLE} margin-right:12px;">'
                f'<div style="{_BUBBLE_USER_STYLE}">{styled_content}</div>'
                '</div>'
                f'<div style="{_AVATAR_USER_STYLE}">U</div>'
                '</div>'
            )
        else:
            parts.append(
                f'<div style="{_ROW_STYLE} text-align:left;">'
                f'<div style="{_AVATAR_AI_STYLE}">AI</div>'
                f'<div style="{_BUBBLE_WRAPPER_STYLE} margin-left:12px;">'
                f'<div style="{_BUBBLE_AI_STYLE}">{styled_content}</div>'
                '</div>'
                '</div>'
            )

    # Footer
    parts.append(
        f'<div style="{_FOOTER_STYLE}">'
        'Generated securely by AI Assistant'
        '</div>'
    )

    # Close document
    parts.append('</div></body></html>')

    return "".join(parts)
