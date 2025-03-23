"""This file implimnets Google's Gemini API, and uses langchain to give RAG-responses 
    to the user's cognitive distortions

    Classes: 
        - Gemini_LLM: This class uses the Gemini API to get respones from the LLM for a varity of methods
    Dependencies:
        - LangChain
        - google

"""
# from utils.firebase import db
import langchain
import base64
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain.chains.retrieval import create_retrieval_chain

load_dotenv()  # Load environment variables from .env file
api_key = os.getenv("API_KEY")

class GeminiLLM:
    """
        Uses Google's Gemini to generate LLM reponses
    """
    def __init__(self, source_data: str):
        self.source_data = source_data
    
    def generate_response(self, input_journal: str, input_distortions: dict[str, str])-> str:
        """Generates a response to be to """
        pass
    
    def highlight_distortion(self, input_journal: str)-> dict[str, str]:
        """Returns a dictionary with the different sentance chunks (that are distorted) 
        from the user's text as the keys, and the distortion catagories as values.
        """
        # Read in input data as a string
        with open("output_distortions.txt", "r", encoding="utf-8") as file:
            distortion_data = file.read()

        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key, convert_system_message_to_human=True)

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
        texts = text_splitter.split_text(distortion_data)

        embeddings = GoogleGenerativeAIEmbeddings(model="text-embedding-005", google_api_key=api_key)
        vector_index = Chroma.from_texts(texts, embeddings).as_retriever(search_kwargs={"k":5})

        # Create a retrieval chain using the LLM and the vector index
        qa_chain = create_retrieval_chain(retriever=vector_index, llm=llm)

        # Use the chain to classify the input text
        result = qa_chain.run("Classify the following distortion data: " + distortion_data)

        # Print the classification result
        print("Classification Result:", result)

###################################
from google.cloud import generativeai_v1beta2 as generative_ai

def list_available_models():
    client = generative_ai.ModelServiceClient()
    models = client.list_models(parent="projects/YOUR_PROJECT_ID/locations/global")
    for model in models:
        print(f"Model Name: {model.name}")
        print(f"Model Description: {model.description}")
        print(f"Supported Methods: {model.supported_methods}")
        print("\n")

list_available_models()

exit()
llm = GeminiLLM(source_data="/Users/gabriel/Documents/GitHub/thoughtmirror/output_distortions.txt")
llm.highlight_distortion("""Today was such a rollercoaster. School was the usual—boring classes, way too much homework, and the same old drama. But at lunch, Mia and I sat outside, and it actually felt like spring for once. We talked about everything—crushes, college, and how weird it is that we’re growing up so fast. Sometimes I wish time would just slow down. Oh, and guess what? I made eye contact with him in the hallway. It was only for like two seconds, but still, my heart did that stupid fluttery thing.

After school, I tried to be productive, but obviously, I ended up scrolling on my phone for hours. Typical. Mom keeps saying I need to focus more, but honestly, my brain feels like mush lately. Maybe it’s just stress, or maybe I need more sleep (not happening). Anyway, I should probably start that history essay before I regret it. Or maybe I’ll just watch one more episode of my show… priorities, right?
March 21, 2025

Another day, another endless list of responsibilities. Work was the usual grind—emails, meetings, and trying to keep up with deadlines that never seem to stop coming. Sometimes I wonder if I’m actually getting anything done or just running in circles. Took a break at lunch to step outside for some fresh air, and for a moment, I just stood there, watching the world move around me. It’s strange how fast time passes. Feels like just yesterday the kids were little, and now they barely have time to talk between school and their own lives. I don’t blame them—I was the same at their age.

Came home exhausted, but of course, there’s always more to do. Bills to pay, things to fix, a million little tasks that never make it onto a to-do list but still need attention. I meant to read tonight, but my eyes are too tired to focus on the pages. Maybe I’ll just sit for a while, let the quiet settle in. Funny how, when you’re younger, you crave excitement, and as you get older, all you want is a little bit of peace.""")

###################################

# def generate():
#     client = genai.Client(
#         api_key=os.environ.get("GEMINI_API_KEY"),
#     )

#     model = "gemini-2.0-flash"
#     contents = [
#         types.Content(
#             role="user",
#             parts=[
#                 types.Part.from_text(text="""INSERT_INPUT_HERE"""),
#             ],
#         ),
#     ]
#     generate_content_config = types.GenerateContentConfig(
#         temperature=1,
#         top_p=0.95,
#         top_k=40,
#         max_output_tokens=8192,
#         response_mime_type="text/plain",
#         system_instruction=[
#             types.Part.from_text(text="""SYSPROMPT HERE"""),
#         ],
#     )

#     for chunk in client.models.generate_content_stream(
#         model=model,
#         contents=contents,
#         config=generate_content_config,
#     ):
#         print(chunk.text, end="")

# if __name__ == "__main__":
#     generate()
