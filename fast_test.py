import requests

# Start a session
res = requests.post('http://localhost:8000/start-session')
session_id = res.json()["session_id"]
print("Session:", session_id)

# Modify count using internal state (not possible via API easily without 20 requests)
# But wait, we can just use the backend code directly to inject it!
import sys
sys.path.append('.')
import sessions
sessions.sessions[session_id]["count"] = 20

# Create fake PDF
with open("test.pdf", "wb") as f:
    f.write(b'fake pdf')

# Finish chat
files = {'file': open('test.pdf', 'rb')}
data = {'session_id': session_id, 'email': 'abhi200326@gmail.com'}
res = requests.post('http://localhost:8000/finish-chat', data=data, files=files)
print("Status:", res.status_code)
print("Response:", res.text)
