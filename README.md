# AI Employee Onboarding Assistant

A school project for my AI Powered class. New hires get answers from one central place instead of going to their manager.

The demo runs on a **fictional company, Meridian Works**. Every person, phone number and email in it is made up (555 numbers, `meridianworks.example` addresses).

## What's in this repo

| File | What it is |
| --- | --- |
| `index.html` | The whole app in one self-contained file. Open it in a browser, or host it anywhere static. |
| `handbook-seed.json` | The handbook content the app ships with (93 sections, about 24,000 words). |
| `Onboarding-Assistant-One-Pager.pdf` | One-page business summary of the idea. |

## What the app does

Eight tabs: Home, Ask, Checklist, Handbook, Data, People, Email and Insights.

- **Ask**: a chat that answers from the handbook and cites the sections it used. It suggests follow-up questions and logs unanswered questions so the handbook can be improved.
- **Handbook**: readable, searchable policies, benefits and how-we-work pages.
- **Data**: 30 lookup tables (holidays, pay dates, plan comparisons, approval limits, contacts and more).
- **People**: a searchable directory of 51 fictional people, an org chart, office lines and outside providers.
- **Email**: pick who to contact and get an AI-drafted email you can open in your mail app.
- **Checklist**: grouped first-weeks checklist with saved progress. Enter your start date on Home to see which day you're on and when training and benefits enrollment are due.
- **Search**: press Ctrl+K (or ⌘K) anywhere to search sections, tables and people, or ask the assistant.
- **Insights**: for editors only; shows unanswered and downvoted questions.

## How the AI is used

The model only answers from the handbook. By default (**Thorough mode**, a checkbox under the chat box) the app sends Claude the whole knowledge base with every question: all 93 sections, all 30 tables and the full people directory, about 50,000 tokens. It also tells the model today's date and which checklist items are done, so it can answer "what should I do next?". That is slower and uses more of the viewer's Claude plan. With Thorough mode off, the app picks the most relevant sections, tables and people (a simple keyword-scoring search) and sends only those, about 9,000 tokens. If the handbook ever grows past a size limit, it falls back to that search automatically. Either way, Claude is asked for a structured answer with sources. If the handbook doesn't cover the question, the app says so instead of guessing.

Questions about sensitive topics (harassment, mental health, safety, legal trouble and similar) are routed to a real person and to crisis resources instead of being answered by the chatbot. This uses keyword rules plus the model's own flag. **The keyword rules miss many indirectly worded messages**, so this is a safety net, not a complete safeguard.

## Limits

This is a classroom demo, not a product ready for a real company:

- No real backend, sign-in, or company account system. It runs on the viewer's own Claude account.
- No security review, audit log, or data-deletion process.
- Search is simple keyword scoring and has not been tested on very large handbooks in a live setup.
- Sensitive-topic detection is incomplete, as described above.
