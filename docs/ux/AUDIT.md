# UX audit (before enterprise polish)

Screenshots: `docs/ux/before/` at 1440, 1024, 768, and 390. Light mode. Capture of later routes was incomplete because the Playwright run stalled after Ask; remaining issues below are from the live app and code review.

## Blocker

| Page | Problem | Fix |
| --- | --- | --- |
| Global | Primary actions used purple pills; brand spec wants blue primaries and navy text. Muted gray `#5c5c5c` on cream is close to failing AA. | Tokenized palette, darker muted text, blue primary buttons. |
| Global | No dark mode; axe previously disabled color-contrast. | Dark tokens + toggle; re-enable contrast checks where tokens allow. |
| Ask | Enter does not send. Composer is not sticky. Loading is a disabled label with no status text. | Chat layout, Enter to send, Shift+Enter newline, "Searching the handbook..." |
| Home | Nine equal nav pills. No single next action in five seconds. | Sidebar IA (Today / Ask / Library / Get help). Home: one primary CTA, progress, Up next. |
| Global | Keyboard users hit a wrapping pill nav; mobile has no persistent primary actions. | Desktop sidebar, mobile bottom bar. |

## Major

| Page | Problem | Fix |
| --- | --- | --- |
| Ask | Single answer card, no message list, no copy, no helpful/talk-to-a-person, no clear conversation. | Message list, copy, helpful links, clear. |
| Week | Flat list, 20px checkboxes, no section progress. | Grouped sections, 44px targets, progress. |
| Library | No in-page search or filters; articles are a wall of cards. | Instant filter + category chips. Article TOC + print. |
| Escalate | Long form, no inline validation, no confirmation timeline. | Short form, validation, "expect a reply" copy. |
| Setup | One long form. | Stepper 1 of 3. |
| Global | No 404 or error boundary. | Add both with help links. |
| Global | Company name can wrap poorly; no logo slot. | Break-words header, optional logo. |

## Minor

| Page | Problem | Fix |
| --- | --- | --- |
| Global | Mixed button styles (`.btn-primary` vs ad hoc). | `components/ui`. |
| Ask | Privacy note missing. | Note under composer. |
| Global | No footer explaining handbook limits. | Footer copy. |
| Library | No breadcrumbs. | Breadcrumbs on articles. |
