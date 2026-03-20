# Vikram Singh Sankhala - SAP AI & BI Portfolio

A comprehensive, professional portfolio website showcasing SAP AI capabilities, pharma analytics solutioning, and expertise. Built for deployment on [Render](https://render.com).

## Contents

- **About** – Executive summary and target role
- **Videos** – 111+ curated SAP YouTube videos (searchable, filterable by category)
- **AI Assistant** – Anthropic Claude-powered chatbot for project Q&A (SAP GCC, pharma analytics, PoCs, etc.)
- **SAP AI Landscape** – Joule, AI Core, RAG, Multi-Agent Orchestration
- **Solutioning** – Pharma GCC SAP BI kickoff approach
- **Use Cases** – Commercial, medical, and operations analytics
- **Recommended PoCs** – 3 high-impact SAP AI pilots
- **Skills** – SAP, BI, AI/ML, Architecture
- **Contact** – Engagement model

## AI Assistant Setup

The site includes an **Anthropic Claude AI Assistant** that answers questions about the project. To enable it:

1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. In Render Dashboard → your service → **Environment** → add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your API key (mark as **Secret**)
3. Redeploy

Without the key, the chat widget still appears but will show a configuration message when used.

## Deploy on Render

### Option 1: One-Click Deploy (GitHub)

1. Push this folder to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New** → **Web Service**
4. Connect your repository
5. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
6. Add `ANTHROPIC_API_KEY` in Environment (optional, for AI Assistant)
7. Click **Deploy**

### Option 2: Blueprint (render.yaml)

1. Ensure `render.yaml` is in your repository root
2. In Render Dashboard: **New** → **Blueprint**
3. Connect the repository
4. Render will detect the blueprint and create the web service

## Test Video Links

All 111 YouTube video links are validated. Run the test script:

```bash
python test_video_links.py
```

## Local Development

Run the Flask app (with AI Assistant, set `ANTHROPIC_API_KEY` in your environment):

```bash
pip install -r requirements.txt
set ANTHROPIC_API_KEY=your-key-here   # Windows
# export ANTHROPIC_API_KEY=your-key-here   # Mac/Linux
python app.py
# Visit http://localhost:5000
```

## Structure

```
Vikram Kumar/
├── app.py            # Flask app + /api/chat (Anthropic Claude)
├── requirements.txt  # Flask, anthropic, gunicorn
├── website/
│   ├── index.html    # Main page
│   ├── styles.css    # Styles
│   ├── script.js     # Interactivity
│   ├── chat-assistant.js  # AI Assistant widget
│   └── videos.js     # Video library data
├── render.yaml       # Render deployment config
└── README.md
```

## Source Documents

Content derived from:
- SAP_AI_Slides.pptx
- Vikram_gcc_solutioning.docx
- vikram_sankhala_resume.docx
