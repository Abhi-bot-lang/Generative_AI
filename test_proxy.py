import requests

# 1. Start a session to get a valid session_id
res = requests.post('http://localhost:5176/start-session')
session_id = res.json()["session_id"]
print("Session:", session_id)

# 2. Send 20 messages to hit the limit
for i in range(20):
    requests.post('http://localhost:5176/chat', json={"session_id": session_id, "message": "hello"})

# 3. Send the finish-chat request
files = {'file': ('chat_history.pdf', b'fake pdf data', 'application/pdf')}
data = {'session_id': session_id, 'email': 'abhi200326@gmail.com'}
res = requests.post('http://localhost:5176/finish-chat', data=data, files=files)

print("Status:", res.status_code)
print("Response:", res.text)
