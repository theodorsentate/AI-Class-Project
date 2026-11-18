# Clickable demo

`handbook-buddy-demo.html` is the real Handbook Buddy app from `../frontend`, packed into a single file. Double-click it to open it in a browser. No server, install, or internet connection is needed (the page tries to load one web font and falls back cleanly without it).

## What works and what is different from the real app

Everything you can click works: all pages, handbook articles, Ask, Ctrl or Cmd+K search, the first-week checklist, start date and due badges, escalation and email drafts, people and tables, the handbook editor, Need support, dark mode.

Differences, because a static file has no server:

- Ask uses the built-in handbook search, not a language model. The real app calls the model only when `OPENAI_API_KEY` is set on the server (see `../frontend/app/api/ask/route.ts`), and it already falls back to this same handbook search when there is no key.
- Settings (theme, start date, checklist) are saved in the browser. If the browser blocks storage, such as in a private window or a sandboxed preview, they are kept in memory and reset on reload. The app does not break.
- Pages switch inside the app rather than through the address bar. This is deliberate, so the demo also works inside sandboxed previews where address changes would blank the page.

## Rebuilding after the app changes

```bash
bash demo/build.sh
```

This copies `../frontend/{app,components,context,lib}` into `demo/spa/src/`, bundles everything with Vite into one HTML file, and writes `demo/handbook-buddy-demo.html`. Only these files are hand-written and committed: `spa/src/main.tsx` (the page router), `spa/src/shims/*` (small stand-ins for `next/link`, `next/navigation`, and `next/font`), `spa/index.html`, `spa/vite.config.ts`, and `spa/package.json`. The copied folders are git-ignored.

Rebuild and commit the HTML whenever `frontend/` changes, so the demo never lags behind the app.
