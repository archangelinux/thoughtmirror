"""This file implimnets Google's Gemini API, and uses langchain to give RAG-responses 
    to the user's cognitive distortions

    Classes: 
        - Gemini_LLM: This class uses the Gemini API to get respones from the LLM for a varity of methods
    Dependencies:
        - LangChain
        - google

"""
from utils.firebase import db
import langchain
import base64
import os
from google import genai
from google.genai import types

class GeminiLLM:
    """
        Uses Google's Gemini to generate LLM reponses
    """
    def __init__(self):
        pass
    
    def generate_response(self, input_journal: str, input_distortions: dict[str, str])-> str:
        """Generates a response to be to """
        pass
    
    def highlight_distortion(self, input_journal: str)-> dict[str, str]:
        """Returns a dictionary with the different sentance chunks (that are distorted) 
        from the user's text as the keys, and the distortion catagories as values.
        """