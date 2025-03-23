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
import pandas as pd

from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, GoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key="your-secret-key-here")

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


@app.post("/delete_entry")
async def delete_entry(request: Request):
    # Manually parse the JSON payload from the request
    payload = await request.json()
    title = payload.get("title")
    creation_date = payload.get("creation_date")  # Frontend sends this key

    # Validate that the required fields exist
    if not title or not creation_date:
        raise HTTPException(status_code=400, detail="Missing title or creation_date.")

    user_id = request.session.get("user_id") or "0"

    fda = FirebaseDataAccess("users", uid=user_id)
    hasher = Hasher()
    post_id = hasher.title_to_postid(title, creation_date)

    try:
        fda.delete_journal_entry(post_id)
    except Exception as e:
        print("Exception:", e)
        raise HTTPException(status_code=500, detail=f"Error deleting entry: {e}")

    return {"message": f"Journal entry {title} deleted successfully."}


@app.get("/get_single_entry")
def get_single_entry(
    request: Request,
    action: str = Query(
        ..., description="Action to perform. Use 'get' to retrieve a journal entry."
    ),
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
        raise HTTPException(
            status_code=400,
            detail="Invalid action for GET request. Only 'get' is allowed.",
        )


@app.post("/handle_single_entry/")
async def handle_single_entry_post(
    request: Request,
    creation_date: str = Body(
        ..., embed=True, description="The creation date of the journal entry."
    ),
    content: str = Body(..., embed=True, description="Journal entry name'"),
    title: str = Body(..., embed=True, description="Journal entry title'"),
):
    hasher = Hasher()
    post_id = hasher.title_to_postid(title, creation_date)
    user_id = request.session.get("user_id") or "0"
    fda = FirebaseDataAccess("users", uid=user_id)
    if title is None or content is None:
        raise HTTPException(
            status_code=400,
            detail="Entry data with title and content is required for posting.",
        )
    # Create a new journal entry and capture the generated post_id
    returned_post_id = fda.add_journal_entry(title, content, post_id)


@app.post("/handle_prediction")
async def handle_prediction(
    request: Request,
    creation_date: str = Body(
        ..., embed=True, description="The creation date of the journal entry."
    ),
    content: str = Body(
        ..., embed=True, description="The content of the journal entry."
    ),
    title: str = Body(..., embed=True, description="The title of the journal entry."),
):

    # save to firebase, exact same as handle single entry
    hasher = Hasher()
    post_id = hasher.title_to_postid(title, creation_date)
    user_id = request.session.get("user_id") or "0"
    fda = FirebaseDataAccess("users", uid=user_id)
    if title is None or content is None:
        raise HTTPException(
            status_code=400,
            detail="Entry data with title and content is required for posting.",
        )
    
        # --- Step 2: Get the prediction for cognitive distortions ---
    try:
        prediction_text = predict(content)  # predict() returns a JSON string
        if "none" in prediction_text.lower():
            return {"prediction": 0, "explanation": 0}
        prediction_dict = json.loads(prediction_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {e}")
    
    # Create a new journal entry and capture the generated post_id
    returned_post_id = fda.add_journal_entry(title, content, post_id, prediction_dict)

    # --- Step 3: Generate an explanation using a RAG pipeline ---
    try:
        qa_chain = create_qa_chain()
        print("qa chain created")
        explanation = generate_explanation(prediction_dict, qa_chain)
        print(explanation)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating explanation: {e}"
        )

    # --- Step 4: Return both the prediction and the explanation ---
    return {"prediction": prediction_dict, "explanation": explanation}


@app.get("/get_calendar_distortions")
def get_calendar_distortions(request: Request):
    user_id = request.session.get("user_id") or "0"
    fda = FirebaseDataAccess("users", uid=user_id)
    entries = fda.get_journal_entries() 

    response = []
    for entry in entries:
        response.append({
            "createdAt": entry["time_created"],
            "distortions": entry.get("detected_distortions", [])
        })
    return response


def save_vectorstore(
    therapist_responses_csv="backend/data/Therapist_responses.csv",
    vectorstore_path="backend/data/therapist_vectorstore",
):
    therapist_df = pd.read_csv(therapist_responses_csv)
    therapist_df.drop(columns=["Question", "Id_Number"], inplace=True)
    therapist_df = therapist_df[:1000]
    therapist_df["Answer"] = therapist_df["Answer"].fillna("").astype(str)  # 1000/4702
    therapist_str = " ".join(therapist_df["Answer"].tolist())

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(therapist_str)

    documents = [Document(page_content=chunk) for chunk in chunks]

    vectorstore.save_local(vectorestore_path)


def predict(journal_entry_content: str):
    LOCATION = "us-central1"
    PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
    FINETUNED_MODEL_NAME = f"projects/{os.getenv('MODEL_ID')}/locations/us-central1/endpoints/{os.getenv('MODEL_ENDPOINT_ID')}"

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

    config = {"temperature": 0.1, "max_output_tokens": 256}

    response = client.models.generate_content(
        model=FINETUNED_MODEL_NAME,
        contents=prompt,
        config=config,
    )

    print("Model Response:", response.text)
    return response.text


def create_qa_chain(vectorstore_path="backend/data/therapist_vectorstore"):
    api_key = os.environ.get("GOOGLE_API_KEY")
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001", google_api_key=api_key
    )

    vectorstore = FAISS.load_local(
        vectorstore_path, embeddings, allow_dangerous_deserialization=True
    )
    retriever = vectorstore.as_retriever(
        search_type="similarity", search_kwargs={"k": 3}
    )
    llm = GoogleGenerativeAI(model="gemini-2.0-flash-001", google_api_key=api_key)

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm, chain_type="stuff", retriever=retriever
    )
    return qa_chain


def generate_explanation(prediction: dict, qa_chain) -> str:
    """
    Given a classifier prediction dict with keys:
      - "Distorted part"
      - "Dominant Distortion"
      - "Secondary Distortion (Optional)"

    Build a prompt and use a RAG pipeline via LangChain to generate a 2-3 sentence explanation.
    """
    # Build the explanation prompt from the prediction.
    explanation_prompt = (
        f"You are a cognitive behavioral therapist helping a patient reflect on how text they wrote demonstrates a cognitive distortion.\n"
        f"Patient's Text: {prediction.get('Distorted part', 'N/A')}\n"
        f"Dominant Distortion: {prediction.get('Dominant Distortion', 'N/A')}\n"
        f"Secondary Distortion (Optional): {prediction.get('Secondary Distortion (Optional)', 'None')}\n\n"
        "Write 2-3 sentences of feedback to gently help the patient reflect on their cognitive distortions."
    )

    # Optionally, include a note that the explanation should be informed by CBT principles.
    full_prompt = explanation_prompt

    # Use the RetrievalQA chain to generate an explanation.
    explanation = qa_chain.invoke(full_prompt)["result"]
    return explanation


if __name__ == "__main__":
    # Test the prediction
    import google.auth

    creds, project = google.auth.default()
    print("Default credentials:", creds)
    print("Credential object details:")
    print(creds.__dict__)
    print("Project:", project)

    prompt = "I’m 12 and have been caught lying many times. I want to stop, but I don’t know how. My mom is on the verge of disowning me. I cry everyday, and try to stop but it just comes out. I feel as if I have to lie because I’m scared of the outcome. I have tried communicating this problem with my parents but they refuse to understand. I have attempted suicide, because I am sick of life. Please, please help before I either kill myself, or my mom disowns me."
    sample_prediction = predict(prompt)
    sample_prediction_dict = json.loads(sample_prediction)
    # Create QA chain
    qa_chain = create_qa_chain()

    # sample_prediction = {"Distorted part": "I don’t know if I’m delusional or a genius. I go through these stages where I have these weird thoughts. Like a few days ago, I convinced myself I was bipolar even though I’ve never had a manic episode or anything close, but I thought I had. I also convinced myself I was autistic, had OCD, and was schizophrenic, schizotypal or schizoid. Now I’m convinced I’m delusional. But that could just be a delusion I wouldn’t be delusional.", "Dominant Distortion": "Labeling", "Secondary Distortion (Optional)": "Fortune-telling"}
    explanation_text = generate_explanation(sample_prediction_dict, qa_chain)
    print(explanation_text)
