# Handbook Buddy

A school project for my AI Powered class. New hires get answers from one central place instead of going to their manager.

The demo runs on a **fictional company, Meridian Works**. Every person, phone number and email in it is made up (555 numbers, `meridianworks.example` addresses).

## What's in this repo

| File | What it is |
| --- | --- |
| `index.html` | The whole app in one self-contained file. Open it in a browser, or host it anywhere static. |
| `handbook-seed.json` | The handbook content the app ships with (93 sections, about 24,000 words). |
| `Onboarding-Assistant-One-Pager.pdf` | One-page business summary of the idea. |
| `frontend/` | The Next.js app we are building and presenting. Sample company: Lumenfield, a fictional software company, with a new Sales Development Rep (Jordan Reyes) as the user. Ask privately, First week, Handbook (41 sections in 7 groups), People, Data tables, search, safety routing, email drafts, a handbook editor, dark mode. |
| `demo/` | `handbook-buddy-demo.html`: the Next.js app packed into one clickable file. No install or server needed. See `demo/README.md`. |

## Static demo

Eight tabs: Home, Ask, Checklist, Handbook, Data, People, Email and Insights.

- **Ask**: a chat that answers from the handbook and cites the sections it used. It suggests follow-up questions and logs unanswered questions so the handbook can be improved.
- **Handbook**: readable, searchable policies, benefits and how-we-work pages.
- **Data**: 30 lookup tables (holidays, pay dates, plan comparisons, approval limits, contacts and more).
- **People**: a searchable directory of 51 fictional people, an org chart, office lines and outside providers.
- **Email**: pick who to contact and get an AI-drafted email you can open in your mail app.
- **Checklist**: grouped first-weeks checklist with saved progress. Enter your start date on Home to see which day you're on and when training and benefits enrollment are due.
- **Search**: press Ctrl+K (or ⌘K) anywhere to search sections, tables and people, or ask the assistant.
- **Insights**: for editors only; shows unanswered and downvoted questions.

## Next.js app (Lumenfield sample)

This is the version we are presenting. The handbook has 31 sections covering first week, pay, time off, benefits, IT and security, equipment, expenses, schedules, conduct, leave, safety, wellbeing, performance, learning, moves and leaving, plus lookup tables and a sample people directory. All names, phone numbers and emails are made up (555 numbers, `northshore.example`).

**Quick look:** open `demo/handbook-buddy-demo.html` in a browser.

**Run it for real:**

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### Turn on the real AI answers

The single-file demo in `demo/` has no server, so it always uses the built-in handbook search. For live AI answers, run or host the Next.js app with a key:

1. Copy `frontend/.env.example` to `frontend/.env.local` and fill in **one** key: `ANTHROPIC_API_KEY` (Claude, default model `claude-haiku-5-5`, change with `ANTHROPIC_MODEL`) or `OPENAI_API_KEY`. Anthropic wins if both are set.
2. `npm run dev`, then ask a question on the Ask page. Answers now come from the model, still limited to the handbook, with sources.
3. To host it (for example on Vercel), import the repo, set the root directory to `frontend`, and add the same key as an environment variable in the host's settings. Never commit a real key.

Crisis wording is never sent to the model, and if the model call fails the app falls back to handbook search, so the Ask page always answers. Without a key, answers still come from the handbook search.

```bash
npm test
npx playwright test
```

Without an API key, Ask quotes the handbook sentences that best match the question. With a key, the model reads the whole handbook and writes the answer.

## How the AI is used

The model only answers from the handbook. By default (**Thorough mode**, a checkbox under the chat box) the app sends Claude the whole knowledge base with every question: all 93 sections, all 30 tables and the full people directory, about 50,000 tokens. It also tells the model today's date and which checklist items are done, so it can answer "what should I do next?". That is slower and uses more of the viewer's Claude plan. With Thorough mode off, the app picks the most relevant sections, tables and people (a simple keyword-scoring search) and sends only those, about 9,000 tokens. If the handbook ever grows past a size limit, it falls back to that search automatically. Either way, Claude is asked for a structured answer with sources. If the handbook doesn't cover the question, the app says so instead of guessing.

Questions about sensitive topics (harassment, mental health, safety, legal trouble and similar) are routed to a real person and to crisis resources instead of being answered by the chatbot. This uses keyword rules plus the model's own flag. **The keyword rules miss many indirectly worded messages**, so this is a safety net, not a complete safeguard.

## Limits

This is a classroom demo, not a product ready for a real company:

- No real backend, sign-in, or company account system. It runs on the viewer's own Claude account.
- No security review, audit log, or data-deletion process.
- Search is simple keyword scoring and has not been tested on very large handbooks in a live setup.
- Sensitive-topic detection is incomplete, as described above.
