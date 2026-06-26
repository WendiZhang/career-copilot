from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from openai import OpenAI
from dotenv import load_dotenv
import os
from flask_jwt_extended import jwt_required, get_jwt_identity

from routes.upload import (
    get_resume_path,
    extract_resume_text
)

load_dotenv()

cover_routes = Blueprint(
    "cover_letter",
    __name__
)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

@cover_routes.route("/api/generate-cover-letter",methods=["POST"])
@jwt_required()
def generate_cover_letter():

    data = request.get_json() or {}

    job_description = data.get(
        "job_description",
        ""
    )
    filename = data.get("filename")
    filepath = get_resume_path(filename)

    if not filepath:
        return jsonify({
            "message": "Please upload a resume first."
        }), 400

    resume_text = extract_resume_text(
        filepath
    )

    response = client.responses.create(
        model="gpt-5-nano",
        input=f"""
        Resume:

        {resume_text}

        Job Description:

        {job_description}

        Write a professional,
        personalized cover letter.

        Keep it concise and
        ATS-friendly.
        """
    )

    return jsonify({
        "cover_letter": response.output_text
    })