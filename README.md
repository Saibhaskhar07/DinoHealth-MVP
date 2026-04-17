# 🦕 Dino Health — AI Results Explainer

Upload a pathology PDF and get a plain English explanation powered by Claude AI.

---

## 🚀 Setup & Run Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
Create a file called `.env.local` in the root folder:
```
ANTHROPIC_API_KEY=your_key_here
```
Get your key from: https://console.anthropic.com

### 3. Run the dev server
```bash
npm run dev
```
Open http://localhost:3000

---

## 🌐 Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. In Vercel project settings → Environment Variables → add:
   - `ANTHROPIC_API_KEY` = your Claude API key
4. Click Deploy — done!

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React |
| Backend | Next.js API Routes (serverless) |
| AI | Anthropic Claude API |
| PDF Parsing | pdf-parse |
| Hosting | Vercel |

---

## ⚠️ Important Notes

- Your API key must NEVER be committed to GitHub — it's in `.env.local` which is gitignored
- The AI is scoped as an education tool only — it does not diagnose conditions (TGA compliant)
- Patient PDFs are not stored anywhere — processed in memory only

---

Built for the University of Adelaide TechE Challenge 2025.
