from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import ResumeAnalysis
import json

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():

    user_id = get_jwt_identity()

    analyses = ResumeAnalysis.query.filter_by(
        user_id=user_id
    ).all()

    latest = ResumeAnalysis.query.filter_by(
        user_id=user_id
    ).order_by(
        ResumeAnalysis.created_at.desc()
    ).first()
    
    keywords = json.loads(latest.keywords) if latest else []
    careers = json.loads(latest.careers) if latest else []
    strengths = json.loads(latest.strengths) if latest else []
    improvements = json.loads(latest.improvements) if latest else []

    return jsonify({
        "resumeScore": latest.score if latest else None,
        "reportsGenerated": len(analyses),
        "keywordsFound": len(keywords),
        "careerMatches": len(careers),
        "latestStrengths": strengths,
        "latestImprovements": improvements,
        "latestCareers": careers
    })