"""
SAP GCC Portfolio - Flask app with Anthropic AI Assistant
Serves static site and /api/chat endpoint for project Q&A
"""
import os
from pathlib import Path

from flask import Flask, request, jsonify, send_from_directory

# Load .env for local development (optional)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__, static_folder="website", static_url_path="")
WEBSITE_DIR = Path(__file__).parent / "website"

SYSTEM_PROMPT = """You are an AI assistant for the SAP GCC Portfolio project. You help visitors understand:

**About the Project & Person:**
- Vikram Singh Sankhala - Senior AI & SAP BTP Architect with 15+ years experience
- Specializes in SAP BI, pharma analytics, SAP BTP, SAP Business AI
- Currently at SAP (superannuating May 2026)
- Available for part-time US time-zone consulting and PoC leadership
- Target role: Senior Architect at US Pharma GCC in India from June 2026

**SAP AI Capabilities:**
- Joule (AI Copilot), SAP AI Core, SAP Analytics Cloud, SAP Datasphere
- RAG & Document Intelligence, Multi-Agent Orchestration
- Predictive Analytics, AI-Powered Automation

**Solutioning & Use Cases:**
- Pharma GCC SAP BI kickoff, phased implementation
- Commercial analytics: Brand Performance, SFE, HCP Segmentation, Patient Funnel, Campaign Analytics
- Medical Affairs: MSL effectiveness, KOL engagement, clinical trial site identification
- Supply chain: S/4HANA IBP, demand sensing

**Recommended PoCs (4-8 weeks each):**
1. AI-Powered Invoice Processing Agent (Finance)
2. Demand Forecasting Copilot (Supply Chain)
3. Multi-Agent HR Knowledge Assistant

**Skills:** SAP BTP, ABAP, CAP, SAP AI Core, Joule, SAC, Datasphere, Power BI, LLMs, RAG, multi-agent systems, AWS/Azure/GCP

**Video Library:** 111+ curated SAP YouTube videos on the site (searchable by category)

Answer questions concisely and helpfully. If asked about contact or engagement, direct them to the contact section. Stay focused on project-related topics."""


@app.route("/")
def index():
    return send_from_directory(WEBSITE_DIR, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(WEBSITE_DIR, path)


@app.route("/api/chat", methods=["POST"])
def chat():
    """Anthropic Claude API chat endpoint."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return jsonify({
            "error": "AI Assistant is not configured. Please add ANTHROPIC_API_KEY to enable the assistant.",
            "reply": None
        }), 503

    try:
        data = request.get_json() or {}
        user_message = data.get("message", "").strip()
        history = data.get("history", [])

        if not user_message:
            return jsonify({"error": "Message is required", "reply": None}), 400

        # Build messages for Claude
        messages = []
        for h in history[-10:]:  # Keep last 10 exchanges
            if h.get("role") == "user":
                messages.append({"role": "user", "content": h.get("content", "")})
            elif h.get("role") == "assistant":
                messages.append({"role": "assistant", "content": h.get("content", "")})
        messages.append({"role": "user", "content": user_message})

        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=messages,
        )

        reply = response.content[0].text if response.content else ""
        return jsonify({"reply": reply, "error": None})

    except Exception as e:
        return jsonify({
            "error": str(e),
            "reply": "Sorry, I encountered an error. Please try again or contact directly."
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
