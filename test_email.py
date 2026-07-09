"""
Empty test file cleared by request.
"""
import sys
from email_service import send_email
with open('test.pdf', 'wb') as f:
    f.write(b'test pdf')
try:
    send_email('abhi200326@gmail.com', 'test.pdf')
except Exception as e:
    print(repr(e))
