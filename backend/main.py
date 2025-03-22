"""
To run, type: fastapi dev backend/main.py
"""
from fastapi import FastAPI, Query, Body, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from utils.firebase import db
import json
from hashing import Hasher
from data_access import FirebaseDataAccess

app = FastAPI()

class JournalEntryPayload(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/get_email")
def get_user_email_from_frontend(request):
    """
    Endpoint: /get_email
    frontend will post, we cache the email and use it as a key into the database
    """
    body = json.loads(request.body)
    user_email = body.get("userEmail")
    request.session["user_email"] = user_email
    print(user_email)
    return {"message": f"Got user's email {user_email}", "data": user_email}

@app.get("/get_all_entries")
def get_all_entries_by_user():
    fda = FirebaseDataAccess("users", uid="ah34r")
    return fda.get_journal_entries()

@app.get("/get_single_entry")
def get_single_entry(
    action: str = Query(..., description="Action to perform. Use 'get' to retrieve a journal entry."),
    post_id: str = Query(..., description="The post ID of the journal entry")
):
    fda = FirebaseDataAccess("users", uid="ah34r")
    if action.lower() == "get":
        entry = fda.get_single_entry(post_id)
        if entry is None:
            raise HTTPException(status_code=404, detail="Journal entry not found")
        return entry
    else:
        raise HTTPException(status_code=400, detail="Invalid action for GET request. Only 'get' is allowed.")

@app.post("/handle_single_entry/")
def handle_single_entry_post(
    action: str = Body(..., embed=True, description="Action to perform: 'post', 'update', or 'delete'"),
    post_id: Optional[str] = Body(None, embed=True, description="The post ID for 'update' or 'delete' actions"),
    entry: Optional[JournalEntryPayload] = Body(None, embed=True, description="Journal entry data for 'post' or 'update'")
):
    fda = FirebaseDataAccess("users", uid="ah34r")
    action = action.lower()
    if action == "post":
        if entry is None or entry.title is None or entry.content is None:
            raise HTTPException(status_code=400, detail="Entry data with title and content is required for posting.")
        # Create a new journal entry and capture the generated post_id
        new_post_id = fda.add_journal_entry(entry.model_dump())
        return {"post_id": new_post_id, "message": "Journal entry created."}
    elif action == "update":
        if post_id is None or entry is None:
            raise HTTPException(status_code=400, detail="Post ID and entry data required for update.")
        updated = fda.update_journal_entry(post_id, entry.model_dump()) # NOT IMPLEMENTED RN
        return updated
    elif action == "delete":
        if post_id is None:
            raise HTTPException(status_code=400, detail="Post ID is required for deletion.")
        fda.delete_journal_entry(post_id)
        return {"message": f"Deleted journal entry {post_id} for user {fda.uid}."}
    else:
        raise HTTPException(status_code=400, detail="Invalid action for POST request. Allowed actions: 'post', 'update', 'delete'.")