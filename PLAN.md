# Employee Onboarding Assistant

## Goal

A single web app any business can configure: first-week needs, a private place to ask questions without going to a manager, and a reliable handbook. Works without an API key; uses an LLM when `OPENAI_API_KEY` is set.

## Phases

### Phase 1: Scaffolding

- [x] `frontend` Next.js app, `.gitignore`, TypeScript, Tailwind
- [x] Color scheme: yellow `#ecad0a`, blue `#209dd7`, purple `#753991`, navy `#032147`, gray `#888888`
- [x] No emojis

Success: `npm run dev` starts.

### Phase 2: Core product

- [x] Home hub with three actions: Ask privately, First week, Handbook
- [x] Company setup (name, industry, contacts, hotline) stored in the browser
- [x] Checklist with dummy first-week tasks
- [x] Knowledge library (IT, pay, time off, benefits, culture, safety)
- [x] Private Q&A grounded in the handbook; low-confidence answers offer confidential HR/IT escalation
- [x] Accessibility: skip link, labels, live region for answers, keyboard navigation

Success: a new hire can complete a task, look up a policy, and get an answer without a manager.

### Phase 3: Tests

- [ ] Unit tests for retrieval ranking
- [ ] Playwright: hub, ask, checklist, library, setup

Success: unit and e2e tests pass.

### Phase 4: Ready

- [x] Dev server running for the user
