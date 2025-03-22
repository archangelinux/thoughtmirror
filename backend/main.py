"""
To run, type: fastapi dev backend/main.py
"""
from fastapi import FastAPI
from utils.firebase import db
import json

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/get_email")
def get_user_email_from_frontend(self, request):
    """
    Endpoint: /get_email
    frontend will post, we cache the email and use it as a key into the database
    """
    body = json.loads(request.body)
    user_email = body.get("userEmail")
    request.session["user_email"] = user_email
    print(user_email)
    return {"message": f"Got user's email {user_email}", "data": user_email}

