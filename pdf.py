import os
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, KeepTogether
from io import BytesIO
import markdown

OUTPUT_FOLDER = "generated_pdfs"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

def add_footer(canvas, doc):
    """Draws a footer with the page number and a separator line on the canvas."""
    canvas.saveState()
    
    # 1. Draw a light gray separator line above the footer
    canvas.setStrokeColor('#cbd5e1') # Light slate gray
    canvas.setLineWidth(1)
    # Starts at X=40, Ends at X=555, Y=35 (just above the text)
    canvas.line(40, 35, 555, 35)
    
    # 2. Draw the page number text
    canvas.setFont('Helvetica', 9)
    canvas.setFillColor('#94a3b8') # Subtle slate gray
    
    page_num = canvas.getPageNumber()
    text = f"AI Chat Export - Page {page_num}"
    
    # Draw text at X=40 (matching left margin), Y=20 (near bottom)
    canvas.drawString(40, 20, text)
    canvas.restoreState()


def generate_chat_pdf_bytes(messages: list) -> bytes:
    """Generates a PDF in memory and returns raw bytes."""
    buffer = BytesIO()
    
    # SimpleDocTemplate manages the page size, margins, and page breaks automatically.
    document = SimpleDocTemplate(
        buffer,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    # 1. Define custom styles instead of relying on default generic styles.
    custom_title_style = ParagraphStyle(
        name='CustomTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        spaceAfter=25,
        textColor='#1e293b', # Slate 800
        alignment=1 # 0=Left, 1=Center, 2=Right
    )

    user_message_style = ParagraphStyle(
        name='UserMessage',
        fontName='Helvetica-Bold',
        fontSize=12,
        spaceAfter=5,
        textColor='#2563eb' # Blue
    )
    
    ai_message_style = ParagraphStyle(
        name='AIMessage',
        fontName='Helvetica-Bold',
        fontSize=12,
        spaceAfter=5,
        textColor='#0f172a' # Dark Slate
    )

    body_style = ParagraphStyle(
        name='BodyText',
        fontName='Helvetica',
        fontSize=11,
        leading=16, # Line height
        textColor='#334155' # Slate 700
    )

    story = []

    # 2. Insert the Logo Image (If the file exists)
    # We construct an absolute path to ensure it works from any execution context.
    logo_path = os.path.join(PROJECT_ROOT, "assets", "logo.png")
    
    if os.path.exists(logo_path):
        # We define a fixed size. If your logo is 400x100, a 4:1 ratio, 
        # using 120x30 maintains that exact ratio.
        logo = Image(logo_path, width=120, height=30)
        story.append(logo)
        story.append(Spacer(1, 20))

    # 3. Insert Title
    story.append(Paragraph("AI Chat Conversation", custom_title_style))

    # 4. Loop through messages and apply custom styles
    for message in messages:
        role = message["role"].capitalize()
        # Convert Markdown to ReportLab-compatible HTML
        raw_text = message["text"]
        html_text = markdown.markdown(raw_text)
        
        # Clean up tags that ReportLab doesn't fully support
        html_text = html_text.replace("<strong>", "<b>").replace("</strong>", "</b>")
        html_text = html_text.replace("<em>", "<i>").replace("</em>", "</i>")
        html_text = html_text.replace("<p>", "").replace("</p>", "<br/>")
        
        # Fix multi-line code blocks
        html_text = html_text.replace("<pre><code>", '<font name="Courier" size="10" color="#334155">')
        html_text = html_text.replace("</code></pre>", "</font>")
        
        # Fix inline code blocks
        html_text = html_text.replace("<code>", '<font name="Courier" color="#0f172a">')
        html_text = html_text.replace("</code>", "</font>")
        
        message_group = []
        
        # Apply different colors based on who is speaking
        if role.lower() == "user":
            message_group.append(Paragraph(f"{role}:", user_message_style))
        else:
            message_group.append(Paragraph(f"{role}:", ai_message_style))
            
        # The actual message content
        message_group.append(Paragraph(html_text, body_style))
        message_group.append(Spacer(1, 15))
        
        # Keep the label and message together so they don't get split across pages
        story.append(KeepTogether(message_group))

    # 5. Build and return, attaching our footer callback for every page
    document.build(
        story, 
        onFirstPage=add_footer, 
        onLaterPages=add_footer
    )
    buffer.seek(0)
    return buffer.read()
