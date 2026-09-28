# Employee onboarding assistant

Next.js app in `frontend`. Configure the business under Company setup. New hires use Ask privately, First week, and Handbook.

```bash
export PATH="$HOME/.local/node-v22.20.0-darwin-arm64/bin:$PATH"
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

Optional: set `OPENAI_API_KEY` so `/api/ask` rewrites handbook answers with an LLM. Without a key, answers still come from the handbook search.

```bash
npm test
npx playwright test
```
