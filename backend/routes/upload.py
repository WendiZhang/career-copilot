import os
import json
import zipfile
import xml.etree.ElementTree as ET
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from openai import OpenAI
from pypdf import PdfReader
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ResumeAnalysis

load_dotenv()

upload_routes = Blueprint("upload", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"pdf", "docx"}
MAX_RESUME_CHARS = 20000

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )

def save_resume(file):
    import uuid
    filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(filepath)

    return filename, filepath

def get_resume_path(filename=None):
    if filename:
        safe_filename = secure_filename(filename)
        filepath = os.path.join(
            UPLOAD_FOLDER,
            safe_filename
        )

        if os.path.isfile(filepath):
            return filepath

        return None

    files = [
        os.path.join(UPLOAD_FOLDER, name)
        for name in os.listdir(UPLOAD_FOLDER)
        if allowed_file(name)
    ]

    if not files:
        return None

    return max(files, key=os.path.getmtime)

def extract_pdf_text(filepath):
    reader = PdfReader(filepath)
    pages = []

    for page in reader.pages:
        pages.append(page.extract_text() or "")

    return "\n".join(pages)

def extract_docx_text(filepath):
    with zipfile.ZipFile(filepath) as docx:
        xml_files = [
            "word/document.xml",
            "word/header1.xml",
            "word/footer1.xml",
        ]

        text_parts = []

        for xml_file in xml_files:
            if xml_file not in docx.namelist():
                continue

            root = ET.fromstring(docx.read(xml_file))

            for node in root.iter():
                if node.tag.endswith("}t") and node.text:
                    text_parts.append(node.text)

        return " ".join(text_parts)

def extract_resume_text(filepath):
    extension = filepath.rsplit(".", 1)[1].lower()

    if extension == "pdf":
        return extract_pdf_text(filepath)

    if extension == "docx":
        return extract_docx_text(filepath)

    return ""

def normalize_list(value, limit=8):
    if not isinstance(value, list):
        return []

    cleaned = []

    for item in value:
        if isinstance(item, str) and item.strip():
            cleaned.append(item.strip())

    return cleaned[:limit]

def normalize_analysis(data):
    score = data.get("score", 0)

    try:
        score = int(score)
    except (TypeError, ValueError):
        score = 0

    score = max(0, min(score, 100))

    return {
        "score": score,
        "strengths": normalize_list(data.get("strengths")),
        "improvements": normalize_list(data.get("improvements")),
        "keywords": normalize_list(data.get("keywords"), 12),
        "careers": normalize_list(data.get("careers"), 6),
    }

def analyze_resume_text(resume_text):
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is not configured.")

    response = client.responses.create(
        model=os.getenv("OPENAI_MODEL", "gpt-5-nano"),
        instructions="""
        You are Career Copilot, an expert resume analyst.

        Analyze the resume text and return practical, evidence-based feedback.
        Score the resume from 0 to 100 for ATS readiness, clarity, impact,
        keyword alignment, and relevance. Do not invent experience that is not
        present in the resume.
        """,
        input=f"""
        Analyze this resume:

        {resume_text[:MAX_RESUME_CHARS]}
        """,
        text={
            "format": {
                "type": "json_schema",
                "name": "resume_analysis",
                "strict": True,
                "schema": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100
                        },
                        "strengths": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 2,
                            "maxItems": 6
                        },
                        "improvements": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 2,
                            "maxItems": 6
                        },
                        "keywords": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 4,
                            "maxItems": 10
                        },
                        "careers": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 2,
                            "maxItems": 5
                        }
                    },
                    "required": [
                        "score",
                        "strengths",
                        "improvements",
                        "keywords",
                        "careers"
                    ]
                }
            }
        }
    )

    return normalize_analysis(json.loads(response.output_text))

@upload_routes.route("/api/upload-resume", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({"message": "No file uploaded"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"message": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({
            "message": "Only PDF and DOCX files are allowed"
        }), 400

    filename, _ = save_resume(file)

    return jsonify({
        "message": "Resume uploaded successfully",
        "filename": filename
    })

@upload_routes.route("/api/analyze-resume", methods=["POST"])
@jwt_required()
def analyze_resume():
    filename = None

    if request.is_json:
        data = request.get_json() or {}
        filename = data.get("filename")

    if "resume" in request.files:
        file = request.files["resume"]

        if file.filename == "":
            return jsonify({"message": "No file selected"}), 400

        if not allowed_file(file.filename):
            return jsonify({
                "message": "Only PDF and DOCX files are allowed"
            }), 400

        filename, _ = save_resume(file)

    filepath = get_resume_path(filename)

    if not filepath:
        return jsonify({
            "message": "Please upload a resume before running analysis."
        }), 400

    try:
        resume_text = extract_resume_text(filepath).strip()

        if not resume_text:
            return jsonify({
                "message": "We could not read text from this resume. Please upload a text-based PDF or DOCX file."
            }), 400

        analysis = analyze_resume_text(resume_text)
        analysis["filename"] = os.path.basename(filepath)
        user_id = get_jwt_identity()
        analysis_record = ResumeAnalysis(
            user_id=user_id,
            filename=os.path.basename(filepath),
            score=analysis["score"],
            strengths=json.dumps(analysis["strengths"]),
            improvements=json.dumps(analysis["improvements"]),
            keywords=json.dumps(analysis["keywords"]),
            careers=json.dumps(analysis["careers"])
        )

        db.session.add(analysis_record)
        db.session.commit()

        return jsonify(analysis)
    except RuntimeError as error:
        return jsonify({"message": str(error)}), 500
    except Exception as error:
        print(error)
        return jsonify({
            "message": "Resume analysis failed. Please try again."
        }), 500
