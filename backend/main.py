"""
To run, type: fastapi dev backend/main.py
"""
from fastapi import FastAPI, Query, Body, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, Dict, Any
from utils.firebase import db
import json
from hashing import Hasher
from data_access import FirebaseDataAccess
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from google import genai
from google.genai.types import HttpOptions
import os 


app = FastAPI()

app.add_middleware(
    SessionMiddleware, secret_key="your-secret-key-here"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend to access backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JournalEntryPayload(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/get_email")
async def get_user_email_from_frontend(request: Request):
    """
    Endpoint: /get_email
    frontend will post, we cache the email and use it as a key into the database
    """
    hasher = Hasher()
    body = await request.json()
    user_email = body.get("userEmail")
    request.session["user_id"] = hasher.email_to_uid(user_email)
    print(user_email)
    return {"message": f"Got user's email {user_email}", "data": user_email}

@app.get("/get_all_entries")
def get_all_entries_by_user(request: Request):
    user_id = request.session.get("user_id") or "0"
    fda = FirebaseDataAccess("users", uid=user_id)
    return fda.get_journal_entries()

@app.get("/get_single_entry")
def get_single_entry( request: Request,
    action: str = Query(..., description="Action to perform. Use 'get' to retrieve a journal entry."),
    post_id: str = Query(..., description="The post ID of the journal entry"),
):

    user_id = request.session.get("user_id") or "0"
    fda = FirebaseDataAccess("users", uid=user_id)
    if action.lower() == "get":
        entry = fda.get_single_entry(post_id)
        if entry is None:
            raise HTTPException(status_code=404, detail="Journal entry not found")
        return entry
    else:
        raise HTTPException(status_code=400, detail="Invalid action for GET request. Only 'get' is allowed.")

@app.post("/handle_single_entry/")
def handle_single_entry_post(request: Request,
    creation_date: str = Body(..., embed=True, description="The creation date of the journal entry."),
    action: str = Body(..., embed=True, description="Action to perform: 'post', 'update', or 'delete'"),
    entry: Optional[JournalEntryPayload] = Body(None, embed=True, description="Journal entry data for 'post' or 'update'")
):
    hasher = Hasher()
    post_id = hasher.title_to_postid(entry.title, creation_date)
    user_id = request.session.get("user_id") or "0"
    fda = FirebaseDataAccess("users", uid=user_id)
    action = action.lower()
    if action == 'post' or action =='update':
        if entry is None or entry.title is None or entry.content is None:
            raise HTTPException(status_code=400, detail="Entry data with title and content is required for posting.")
        # Create a new journal entry and capture the generated post_id
        returned_post_id = fda.add_journal_entry(entry.model_dump(), post_id)
        return {"post_id": returned_post_id, "message": "Journal entry created."}
    elif action == "delete":
        if post_id is None:
            raise HTTPException(status_code=400, detail="Post ID is required for deletion.")
        fda.delete_journal_entry(post_id)
        return {"message": f"Deleted journal entry {post_id} for user {fda.uid}."}
    else:
        raise HTTPException(status_code=400, detail="Invalid action for POST request. Allowed actions: 'post', 'update', 'delete'.")


def predict(journal_entry_content: str): 
    LOCATION = "us-central1"
    PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID')
    FINETUNED_MODEL_NAME = os.getenv('FINETUNED_MODEL_NAME')

    prompt = (
        f"Journal Entry: {journal_entry_content}\n"
        "Analyze the text for cognitive distortions. Identify any distorted part(s) and classify them as one of: "
        "All-or-Nothing Thinking, Overgeneralization, Mental Filter, Should Statements, Labeling, Personalization, "
        "Magnification, Emotional Reasoning, Mind Reading, or Fortune-Telling. "
        "Output your answer as:\n"
        "Distorted part: <text>\nDominant Distortion: <distortion>\nSecondary Distortion (Optional): <if any>"
    )

    client = genai.Client(
        vertexai=True,
        project=PROJECT_ID,
        location=LOCATION,
        http_options=HttpOptions(api_version="v1"),
    )

    config = {
        "temperature": 0.1,
        "max_output_tokens": 256
    }

    response = client.models.generate_content(
        model=FINETUNED_MODEL_NAME, 
        contents=prompt,
        config=config,
    )

    print("Model Response:", response.text)
    return response.text
