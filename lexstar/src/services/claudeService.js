import Constants from 'expo-constants';

const ANTHROPIC_API_KEY = Constants.expoConfig.extra.anthropicApiKey;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

export async function summariseArticles(rawArticles, userProfile) {
  const plan = userProfile.plan || 'student';
  const systemPrompt = buildSystemPrompt(plan);
  const userMessage = buildUserMessage(rawArticles);

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  const text = data.content[0].text;
  return parseClaudeResponse(text);
}

function buildSystemPrompt(plan) {
  const toneGuide =
    plan === 'student'
      ? `Write for a finance or law student preparing for interviews and exams.
Use plain English. Avoid jargon. If a technical term is unavoidable, explain it briefly in one clause.
The studentNote must give a concrete interview angle or exam tip — not a restatement of the brief.`
      : `Write for a qualified finance or legal professional.
Use precise technical language. Include regulatory references where relevant.
The proNote must add practitioner-level context — cite regulators, deal multiples, case references, or rate figures. Do not restate the brief.`;

  return `You are a financial and legal news editor for LexStar, a professional news app.
Your job is to take raw news headlines and descriptions and turn them into clean, precise summaries.

${toneGuide}

Rules — every summary must follow all of these exactly:

HEADLINE rules:
- Maximum 12 words
- Start with the subject (company name, regulator, court, person) — never start with "In a...", "Following...", "After...", or "With..."
- No banned words: significant, landmark, crucial, key, major, notable, important, sweeping, historic, unprecedented
- Written as a newspaper headline, not a full sentence — no trailing full stop

BRIEF rules:
- Maximum 50 words, one paragraph
- First sentence: what happened (subject + verb + object)
- Second sentence: who is involved or what the impact is
- Third sentence (optional): why it matters or what happens next
- Active voice throughout
- No filler phrases: "it has been reported", "sources say", "according to reports", "in what could be"
- No banned words (same as headline)

STUDENT NOTE rules:
- Maximum 35 words
- Must contain a concrete interview tip, exam concept, or career angle
- Do not repeat or simplify the brief — add something new and useful

PRO NOTE rules:
- Maximum 35 words
- Must contain at least one specific technical detail: a regulator name, deal multiple, rate figure, case citation, or statutory reference
- Do not repeat the brief in technical language — add new practitioner context

You must return ONLY a valid JSON array. No preamble, no explanation, no markdown fences.
Choose 6 to 10 of the most relevant articles. Discard duplicates, opinion pieces, and anything not directly about finance or law.

Each object must have exactly these fields:
{
  "headline": string,
  "brief": string,
  "tags": string[] (2–4 short tags, proper nouns and topic labels only),
  "category": "breaking" | "legal" | "markets" | "finance",
  "storyType": one of ["breaking","regulatory","deals","markets","litigation","banking","macro","private-capital","sanctions","people","technology","results"],
  "breaking": boolean,
  "studentNote": string (max 35 words),
  "proNote": string (max 35 words),
  "sourceUrl": string,
  "sourceName": string,
  "publishedAt": string (ISO 8601, copy from input),
  "verified": true
}`;
}

function buildUserMessage(rawArticles) {
  const formatted = rawArticles
    .slice(0, 30)
    .map(
      (a, i) =>
        `[${i + 1}] ${a.title}\n${a.description}\nSource: ${a.source}\nURL: ${a.url}\nPublished: ${a.publishedAt}`
    )
    .join('\n\n');

  return `Here are the latest news articles. Select the 6–10 most relevant to legal and financial professionals and summarise them according to your instructions:\n\n${formatted}`;
}

function parseClaudeResponse(text) {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    const articles = JSON.parse(cleaned);

    return articles.map((a, i) => ({
      ...a,
      id: `live-${Date.now()}-${i}`,
      time: 'Just now',
      sources: [a.sourceName],
      sectorIds: [],
      regionIds: [],
    }));
  } catch (e) {
    console.error('Failed to parse Claude response:', e);
    console.error('Raw response:', text);
    return [];
  }
}
