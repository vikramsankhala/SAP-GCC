# Vikram Singh Sankhala - SAP AI & BI Portfolio

A comprehensive, professional portfolio website showcasing SAP AI capabilities, pharma analytics solutioning, and expertise. Built for deployment on [Render](https://render.com).

## Contents

- **About** – Executive summary and target role
- **Videos** – 111+ curated SAP YouTube videos (searchable, filterable by category)
- **SAP AI Landscape** – Joule, AI Core, RAG, Multi-Agent Orchestration
- **Solutioning** – Pharma GCC SAP BI kickoff approach
- **Use Cases** – Commercial, medical, and operations analytics
- **Recommended PoCs** – 3 high-impact SAP AI pilots
- **Skills** – SAP, BI, AI/ML, Architecture
- **Contact** – Engagement model

## Deploy on Render

### Option 1: One-Click Deploy (GitHub)

1. Push this folder to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New** → **Static Site**
4. Connect your repository
5. Configure:
   - **Build Command:** `echo "Deploying static site"`
   - **Publish Directory:** `website`
6. Click **Deploy**

### Option 2: Blueprint (render.yaml)

1. Ensure `render.yaml` is in your repository root
2. In Render Dashboard: **New** → **Blueprint**
3. Connect the repository
4. Render will detect the blueprint and create the static site

### Option 3: Manual Setup

1. Create a new **Static Site** on Render
2. Set **Publish Directory** to `website`
3. Leave **Build Command** empty or use `echo "OK"`
4. Deploy

## Test Video Links

All 111 YouTube video links are validated. Run the test script:

```bash
python test_video_links.py
```

## Local Development

Open `website/index.html` in a browser, or use a local server:

```bash
cd website
python -m http.server 8000
# Visit http://localhost:8000
```

## Structure

```
Vikram Kumar/
├── website/
│   ├── index.html    # Main page
│   ├── styles.css    # Styles
│   └── script.js     # Interactivity
├── render.yaml       # Render deployment config
└── README.md
```

## Source Documents

Content derived from:
- SAP_AI_Slides.pptx
- Vikram_gcc_solutioning.docx
- vikram_sankhala_resume.docx
