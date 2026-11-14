# Ideagentech Debugger

A lightweight, stateless web tool that detects and fixes code bugs using the Google Gemini API. Built with a zero-database architecture so code snippets and uploaded archives are processed in memory and never stored on a server.

**Live Demo:** [Add your Vercel link here after deploying]

---

## Why I Built This
Most online AI code tools require account sign-ups, store your code history in a database, or rely on heavy frontend frameworks. I wanted a fast, single-purpose debugger that runs entirely in the browser tab and delegates API calls to a single serverless endpoint.

## How It Works
- **Frontend (`index.html`):** A static interface where you can paste raw code snippets or upload a small `.zip` archive of a project.
- **Serverless Backend (`api/fix.js`):** A single Vercel function that receives the code payload, injects the API credentials from environment variables, and communicates with Gemini.
- **Model Fallback:** Configured with primary (`GEMINI_MODEL`) and backup (`GEMINI_FALLBACK_MODEL`) environment variables so the app stays functional if a model hits rate limits or gets deprecated.
- **Bring Your Own Key (BYOK):** If the hosted API quota runs out, users can paste their own free Google AI Studio key directly into the UI for that session.

## Project Structure
```text
├── api/
│   └── fix.js        # Serverless endpoint handling Gemini API requests
├── index.html        # Frontend UI and client-side zip/code handling
├── package.json      # Dependencies
├── vercel.json       # Vercel routing and function configuration
└── .gitignore        # Excludes local .env credentials
