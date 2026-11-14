// Ideagentech Debugger backend: stateless proxy to Gemini. Stores nothing.
const BASE = "https://generativelanguage.googleapis.com/v1beta/models/";

async function ask(model, key, prompt) {
  const r = await fetch(BASE + model + ":generateContent", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
    })
  });
  return { s: r.status, j: await r.json().catch(() => ({})) };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const b = req.body || {};
  const key = b.userKey || process.env.GEMINI_API_KEY;
  if (!key) return res.status(400).json({ error: "No API key set. Paste your free Gemini key in the page." });
  if (typeof b.code !== "string" || !b.code.trim() || b.code.length > 110000)
    return res.status(413).json({ error: "Code missing or too large." });

  const goal = String(b.description || "not given").slice(0, 3000);
  const map = String(b.projectMap || "").slice(0, 8000);
  const prompt = b.mode === "analyze"
    ? `Project goal: ${goal}\nBelow are the files of a project with the first lines of each. List the paths that most likely contain bugs, errors or problems (include a path if unsure). Return ONLY JSON: {"files":["path"]}\n${b.code}`
    : `You are an expert debugger for every programming language. Fix all bugs, errors, security problems and bad practices in this file while preserving its behavior, style and public interfaces. Return the COMPLETE corrected file, never truncated or abbreviated. If nothing is wrong, set changed=false and return the code unchanged.\nProject goal: ${goal}\nOther project files:\n${map}\nFile: ${b.path || "snippet"}\n\`\`\`\n${b.code}\n\`\`\`\nReturn ONLY JSON: {"changed":boolean,"fixed_code":string,"summary":string,"issues":[{"line":number,"severity":"high|medium|low","explanation":string}]}`;

  const models = [process.env.GEMINI_MODEL || "gemini-2.5-flash", process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash-lite"];
  let last;
  for (const m of models) {
    last = await ask(m, key, prompt);
    if (last.s === 200) break;
    if (![404, 429, 500, 503].includes(last.s)) break;
  }
  if (last.s !== 200) {
    const quota = last.s === 429;
    return res.status(quota ? 429 : 502).json({
      error: quota ? "Gemini quota reached. Wait a minute, or paste your own free Gemini key."
                   : `Gemini error ${last.s}: ${(last.j.error && last.j.error.message) || "unknown"}`
    });
  }
  try {
    const t = last.j.candidates[0].content.parts.map(p => p.text || "").join("").replace(/^```json|```$/g, "").trim();
    return res.status(200).json(JSON.parse(t));
  } catch (e) {
    return res.status(502).json({ error: "The AI returned an unreadable answer. Try again." });
  }
};
