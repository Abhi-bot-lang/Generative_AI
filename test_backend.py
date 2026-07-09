"""
Empty test file cleared by request.
"""
import requests

# 1. Start a session
res = requests.post('http://localhost:8000/start-session')
session_id = res.json()["session_id"]
print("Session:", session_id)

# 2. Add 20 messages
for _ in range(20):
    requests.post('http://localhost:8000/chat', json={"session_id": session_id, "message": "hello"})

# 3. Create a fake PDF
with open("test.pdf", "wb") as f:
    f.write(b'fake pdf')

# 4. Finish chat
files = {'file': open('test.pdf', 'rb')}
data = {'session_id': session_id, 'email': 'abhi200326@gmail.com'}
res = requests.post('http://localhost:8000/finish-chat', data=data, files=files)
print("Status:", res.status_code)
print("Response:", res.text)
