# LexStar — Phase 2–8 Prompts

Each prompt below is a self-contained instruction for the next coding session.
Feed them one at a time, in order. Each phase builds on the previous one.

---

## Phase 2 — Tag & Filter System

We are building LexStar, a React legal/financial news app (Vite + React 18, dark theme).
Phase 1 is complete: the app shell, onboarding, plan selection, and navigation skeleton all exist in `src/App.jsx`.

**Your task for Phase 2:**

Add a fully working tag and filter system. All changes go into `src/App.jsx` unless you need a new file.

1. **Filter panel** — When the user taps "Filter ≡" in the header, slide up a bottom-sheet panel (dark, same design tokens as Phase 1). It should contain:
   - A "Detail level" toggle (Headlines / Brief / Full) — move it here from the feed header.
   - A "Categories" row with chips: Breaking, Legal, Markets, Finance — tapping toggles on/off.
   - A "Tags" section with the following chips the user can toggle:
     - **Sector:** Banking, Asset Management, Private Equity, Insurance, Real Estate
     - **Legal:** Antitrust, Compliance, Regulation, Litigation, M&A Law
     - **Geography:** United States, United Kingdom, European Union, Asia-Pacific, Global
     - **Market:** NYSE, LSE, Nasdaq, HKEX, Euronext
   - A "Clear all" link and an "Apply" button (gold CTA).
2. **Filter state** — lift filter state to the root `LexStarApp` component so every screen can read it.
3. **Feed filtering** — filter `MOCK_ARTICLES` by selected categories and tags; if nothing is selected, show everything.
4. **Active filter count badge** — show a small gold badge on the Filter button (e.g. "3") when filters are active.
5. **Animations** — the bottom-sheet slides up/down smoothly (CSS transform + transition, no external libraries).

Keep all existing design tokens (color object `C`, fonts, `BASE_CSS`). Do not change the onboarding or navigation. Do not add any npm packages.

---

## Phase 3 — Markets Screen

We are building LexStar, a React legal/financial news app (Vite + React 18).
Phases 1–2 are complete. The app has an onboarding flow, plan selection, a filtered news feed, and a tag system.

**Your task for Phase 3:**

Build out the Markets screen (currently a placeholder at `activeNav === "markets"`). All work goes in `src/App.jsx` and a new file `src/markets.js` for static data.

1. **Exchange selector** — a horizontally scrollable tab bar at the top:
   - Tabs: NYSE · Nasdaq · LSE · HKEX · Euronext · ASX · TSX · Nikkei
   - Active tab has the gold underline; inactive tabs use `C.textDim`.
2. **Index card** — below the tabs, show a card for the selected exchange with:
   - Exchange full name, region flag emoji, local time (calculated from a UTC offset you hard-code per exchange).
   - Index value, daily change (+ or −, coloured green/red), percentage change.
   - A row of 7 small "sparkline" bars built from an array of 7 mock daily values — no charting library, just `<div>` bars.
3. **Top movers** — below the index card, show two columns ("Gainers" / "Losers"), each with 3 mock ticker rows: symbol, company name, % change, coloured green/red.
4. **Market news strip** — at the bottom, a horizontally scrollable strip of 3–4 market-specific `ArticleCard` stubs (headline + time only, no brief). Tapping one expands it inline.
5. **Mock data** — put all exchange data, movers, and market news in `src/markets.js` as named exports. Phase 7 will replace this with live data.
6. **Design** — same dark tokens, same font. No external packages. Cards use `C.surface` background with `C.border` borders, consistent with the feed.

---

## Phase 4 — Archive Screen & Search

We are building LexStar, a React legal/financial news app (Vite + React 18).
Phases 1–3 are complete. The app has onboarding, plan selection, a filtered live feed, tag filters, and a live markets screen.

**Your task for Phase 4:**

Build out the Archive screen (currently a placeholder at `activeNav === "archive"`). Add an archive data file `src/archive.js`.

1. **Date navigation** — a sticky header with a "← Week" / "Week →" control to page through past weeks. Show the week range (e.g. "12–18 Feb 2025") in gold.
2. **Search bar** — a dark input field that filters archive articles by keyword (headline + tags). Show a "× Clear" button when text is present.
3. **Category filter pills** — a single horizontal scroll row of category pills (same as Phase 2 tags) to narrow results.
4. **Article list** — render matching archive articles using the existing `ArticleCard` component. Show a "No results" empty state (with a brief message) when filters return nothing.
5. **Archive data** — `src/archive.js` exports `ARCHIVE_ARTICLES`: an array of 12 articles spread across the past 3 weeks, covering a mix of categories and tags. Each article has the same shape as `MOCK_ARTICLES` in Phase 1 plus a `date` field (ISO string).
6. **Performance** — derive filtered results with `useMemo` so the list doesn't recompute on every keystroke unnecessarily.
7. **Design** — no new design tokens needed. Match the feed's look exactly. No external packages.

---

## Phase 5 — Profile Screen & Settings

We are building LexStar, a React legal/financial news app (Vite + React 18).
Phases 1–4 are complete. The app has onboarding, plan selection, a filtered live feed, tag filters, markets, and an archive.

**Your task for Phase 5:**

Build out the Profile screen (currently a placeholder at `activeNav === "profile"`).

1. **Plan badge** — at the top, a card showing the user's current plan (Student / Professional) with its accent colour, plan tagline, and a "Switch plan" button that reopens the onboarding plan-selection step without resetting anything else.
2. **Preferences section** — a list of toggle rows, each with a label on the left and a pill toggle switch on the right (no external libraries — build the toggle with CSS + state):
   - Default detail level (Headlines / Brief / Full) — a 3-way segmented control.
   - "Show student interview tips" — only visible for Student plan.
   - "Show regulatory citations" — only visible for Pro plan.
   - "Market data overlays" — Pro only.
   - "Breaking news alerts" — both plans (placeholder; wires up in Phase 8).
3. **Saved tags** — display the user's currently active tag filters (from Phase 2 state) as chips with an × to remove individual tags, and an "Edit" link that opens the filter panel.
4. **About section** — a simple footer group: App version (1.0.0), "Privacy Policy" and "Terms of Service" links (placeholder hrefs), a "Sign out" button (resets to onboarding).
5. **State persistence** — use `localStorage` to save plan, preferences, and saved tags so they survive a page refresh. Load them on app init in `LexStarApp`.
6. **Design** — use section headers in small caps (`C.textDim`, `DM Sans` 10px letter-spaced) to group rows. No external packages.

---

## Phase 6 — Article Detail View & Source Links

We are building LexStar, a React legal/financial news app (Vite + React 18).
Phases 1–5 are complete. The app persists settings, has all four main screens, tag filters, and markets.

**Your task for Phase 6:**

Add a full-screen article detail view and enrich both Student and Professional plan content.

1. **Article detail screen** — when a user taps an `ArticleCard`, instead of expanding inline (remove that behaviour), push a new `ArticleDetailScreen` that slides in from the right (CSS `transform: translateX` animation). A "← Back" button in the header slides it back out.
2. **Detail screen layout:**
   - Category + timestamp + verified badge at the top.
   - Headline in `DM Serif Display`, large (24px).
   - Full brief paragraph.
   - **Student plan extras** (if plan === "student"):
     - "Why this matters for you" callout box (same style as Phase 1 inline callout).
     - "Interview question" — a mock question related to the article (hard-coded per article for now).
     - "Key terms" — 2–3 terms with one-line definitions, in a styled list.
   - **Pro plan extras** (if plan === "pro"):
     - "Regulatory context" — 1–2 sentence cite of the relevant regulation or statute.
     - "Market impact" — brief note on price/volume implications.
     - "Related deals / cases" — 1–2 bullet points.
   - **Source links section** — a list of the article's sources, each rendered as a tappable row with a right-arrow, the outlet name, and a placeholder URL (`href="#"`). Visually separate from the body.
   - Tags row at the bottom, same chip style as the feed.
3. **Back navigation** — pressing the phone back gesture or the "← Back" button returns to the previous screen without losing scroll position on the feed.
4. **No new packages.** All animation via CSS. Enrich `MOCK_ARTICLES` and `ARCHIVE_ARTICLES` with `studentNote`, `interviewQuestion`, `keyTerms`, `regulatoryContext`, `marketImpact`, and `relatedItems` fields.

---

## Phase 7 — Live AI News Feed (Claude API Integration)

We are building LexStar, a React legal/financial news app (Vite + React 18, Vite dev server).
Phases 1–6 are complete. The app has all screens, article detail view, plan-specific content, tag filters, archive, markets, and localStorage persistence.

**Your task for Phase 7:**

Replace mock articles with a live AI-curated news pipeline. This phase introduces a lightweight Node.js/Express backend.

### Backend (`server/`)

1. Create `server/index.js` — an Express server (port 4000) with these endpoints:
   - `GET /api/feed?plan=student|pro` — returns an array of summarised articles.
   - `GET /api/archive?from=ISO&to=ISO` — returns articles for a date range.
   - `GET /api/markets/:exchange` — returns index + movers data.

2. Create `server/newsService.js`:
   - Fetch headlines from **NewsAPI** (`newsapi.org` — free tier, key from `.env` as `VITE_NEWS_API_KEY`).
   - Query: `q=(law OR regulation OR finance OR markets OR antitrust OR banking)&language=en&pageSize=20`.
   - For each article, call the **Anthropic Claude API** (`claude-sonnet-4-5`, key from `.env` as `ANTHROPIC_API_KEY`) with a prompt that:
     - Summarises the article in ≤ 60 words.
     - Verifies the story appears in at least 3 sources (use the `source.name` field from NewsAPI; group by title similarity).
     - Returns JSON with fields: `headline`, `brief`, `category`, `tags`, `sources`, `verified`, `studentNote`, `interviewQuestion`, `keyTerms`, `regulatoryContext`, `marketImpact`.
   - Cache results in memory for 5 minutes to avoid hammering APIs.

3. Create `server/marketsService.js`:
   - Fetch live index data from **Alpha Vantage** free tier (`ALPHA_VANTAGE_KEY` in `.env`).
   - Fallback to the static `src/markets.js` mock data if the API call fails.

4. Add `server/package.json` with dependencies: `express`, `cors`, `node-fetch`, `@anthropic-ai/sdk`, `dotenv`.

### Frontend changes

5. In `src/App.jsx`, replace all references to `MOCK_ARTICLES` with a `useFeed` custom hook (`src/hooks/useFeed.js`) that:
   - Calls `GET /api/feed?plan=...` on mount and when the plan changes.
   - Returns `{ articles, loading, error }`.
   - Shows `SkeletonCard` placeholders while loading.
   - Shows a brief error banner (red, dismissible) if the fetch fails.

6. Replace static markets data with a `useMarkets` hook (`src/hooks/useMarkets.js`) that calls `GET /api/markets/:exchange`.

7. Add a `.env.example` file documenting required keys: `VITE_NEWS_API_KEY`, `ANTHROPIC_API_KEY`, `ALPHA_VANTAGE_KEY`.

8. Update `vite.config.js` to proxy `/api` requests to `http://localhost:4000` during development.

**Do not commit real API keys.** Use `.env` locally (already in `.gitignore`).

---

## Phase 8 — Deployment & Public Access

We are building LexStar, a React legal/financial news app (Vite + React 18 frontend, Express backend).
Phases 1–7 are complete. The app is fully functional locally with live AI news, markets data, filters, archive, plan-specific views, article detail, and localStorage persistence.

**Your task for Phase 8:**

Make LexStar publicly accessible on the internet. Keep it simple and low-cost.

### Deployment targets

1. **Frontend → Vercel**
   - Create `vercel.json` at the repo root:
     ```json
     {
       "rewrites": [{ "source": "/api/(.*)", "destination": "https://<BACKEND_URL>/api/$1" }]
     }
     ```
   - Add build command `npm run build` and output dir `dist` to Vercel project settings (document the steps in `DEPLOY.md`).
   - All `VITE_*` env vars must be set in the Vercel dashboard (document which ones).

2. **Backend → Railway (or Render free tier)**
   - Create `Procfile`: `web: node server/index.js`
   - Make the Express server read `PORT` from `process.env.PORT` (fallback 4000).
   - Document the Railway/Render deploy steps in `DEPLOY.md`.
   - Set `ANTHROPIC_API_KEY`, `VITE_NEWS_API_KEY`, `ALPHA_VANTAGE_KEY` as environment variables in the hosting dashboard.

3. **CORS** — update `server/index.js` to allow requests from the Vercel production domain (read from `process.env.ALLOWED_ORIGIN`).

4. **PWA (Progressive Web App)**
   - Add `public/manifest.json` so users can "Add to Home Screen" on iOS and Android:
     - `name`: "LexStar", `short_name`: "LexStar"
     - `theme_color`: "#080A0F", `background_color`: "#080A0F"
     - `display`: "standalone"
     - `icons`: at least 192×192 and 512×512 (create simple SVG-based PNGs using the ⚖ logo).
   - Add a `<link rel="manifest">` tag in `index.html`.
   - Register a basic service worker (`public/sw.js`) that caches the app shell for offline use.

5. **DEPLOY.md** — write clear, step-by-step deployment instructions a non-developer can follow:
   - Fork/clone the repo.
   - Set up API keys (where to get NewsAPI, Anthropic, Alpha Vantage free-tier keys).
   - Deploy backend to Railway in 5 steps.
   - Deploy frontend to Vercel in 5 steps.
   - How to update the app after making changes.

6. **Final checks**
   - Confirm `npm run build` produces no errors.
   - Confirm the service worker does not cache API responses (only static assets).
   - Confirm `.env` is in `.gitignore` and no secrets are in the committed code.
