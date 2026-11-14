# Ideagentech Debugger

Stateless AI code fixer. Static page (index.html) + one Vercel function (api/fix.js) + Gemini API.
No database, no login, no history. Everything lives in the browser tab.

## Deploy (steps outside this zip)
1. Get a free key: https://aistudio.google.com/apikey (check your limits in the AI Studio console).
2. Put this folder on GitHub (or run `npx vercel` inside it).
3. Vercel > Add New Project > import the repo. Framework Preset: Other. No build command.
4. Settings > Environment Variables: add GEMINI_API_KEY (and optionally GEMINI_MODEL, GEMINI_FALLBACK_MODEL). Redeploy.
5. Open your URL, paste a snippet, then test a small zip.

## Keep it working for months
- Model names are env vars. If Google retires one, change GEMINI_MODEL in Vercel, no code edit.
- Users can paste their own free Gemini key in the page if your shared quota runs out.
- Vercel Hobby is for personal, non-commercial use. Check Vercel's terms before a public launch.
- Local test: `npx vercel dev` with a .env file (see .env.example).
