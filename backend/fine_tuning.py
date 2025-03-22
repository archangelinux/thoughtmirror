
import time

from google import genai

# For extracting vertex experiment details.
from google.cloud import aiplatform
from google.cloud.aiplatform.metadata import context
from google.cloud.aiplatform.metadata import utils as metadata_utils
from google.genai import types

# For data handling.
import jsonlines
import pandas as pd

# For visualization.
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# For evaluation metric computation.
from rouge_score import rouge_scorer
from tqdm import tqdm

import os
from dotenv import load_dotenv

# For fine tuning Gemini model.
import vertexai


if __name__ == "__main__":
    load_dotenv()

    # Set Google Cloud project information and initialize Vertex AI and Gen AI SDK
    PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID')  # @param {type:"string"}
    REGION = "us-central1"  # @param {type:"string"}

    vertexai.init(project=PROJECT_ID, location=REGION)

    client = genai.Client(vertexai=True, project=PROJECT_ID, location=REGION)