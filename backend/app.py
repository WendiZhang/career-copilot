import os
from datetime import timedelta
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db
from routes.ai import ai_routes
from routes.upload import upload_routes
from routes.auth import auth_routes
from routes.cover_letter import cover_routes
from routes.dashboard import dashboard_bp

load_dotenv()

app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": [
        "http://localhost:5173",
        "https://career-copilot-ruby.vercel.app"
    ]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "sqlite:///career.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)

db.init_app(app)
JWTManager(app)

app.register_blueprint(ai_routes)
app.register_blueprint(upload_routes)
app.register_blueprint(auth_routes)
app.register_blueprint(cover_routes)
app.register_blueprint(
    dashboard_bp,
    url_prefix="/api"
)

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return {"message": "Career Copilot API is running"}

if __name__ == "__main__":
    app.run(debug=True)