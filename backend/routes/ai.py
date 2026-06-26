from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

ai_routes = Blueprint("ai", __name__)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

@ai_routes.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    messages = data.get("messages", "")

    response = client.responses.create(
        model="gpt-5-nano",
        instructions="""
        You are Career Copilot.

        Help users with:
        - resumes
        - cover letters
        - interview preparation
        - career changes
        - UI/UX design careers
        - AI development careers

        Give practical and actionable advice.
        """,
        input=messages
    )

    return jsonify({
        "reply": response.output_text
    })