# Feature gap: index.html demo vs Next.js frontend

Source: `/index.html` (Meridian Works demo) compared with `/frontend`. Ported items use Northshore Goods sample data, not Meridian names or handbook text.

| Feature or material in index.html | Next.js today | Port / skip / why |
| --- | --- | --- |
| Thorough / full-corpus LLM answers (`fullCorpusText`, `canSendAll`, `systemPrompt`, `hireContext`) | Optional OpenAI route sends only top retrieved sections | **Port** |
| JSON answer with sources, answerable, sensitive, follow-ups | Plain text rewrite of retrieve snippets | **Port** (follow-ups if the model returns them) |
| OpenAI/Claude key never on the client | Key already server-only | **Port** keep as-is |
| Crisis classifier (`CRISIS`) and 988 / EAP resources | Thin keyword list in retrieve | **Port** |
| Sensitive routing (`SENSITIVE`, `classify`, informational exception) | All harassment keywords treated the same | **Port** |
| Model `sensitive` flag honored | Ignored | **Port** |
| Need support? on every view | Missing | **Port** |
| Start date in localStorage and Day N | Missing | **Port** |
| Due badges from handbook deadlines only | Missing | **Port** |
| Today highlight and Up next | Missing | **Port** |
| Ctrl/Cmd+K search palette | Missing | **Port** |
| Ask the assistant row in search | Missing | **Port** |
| Search dialog focus trap and Escape | Missing | **Port** |
| AI-drafted email to People Ops / IT | Escalate page is a static form | **Port** |
| Email fallback template without a model | N/A | **Port** |
| Handbook editor, validate, sanitize, adopt | Company fields only | **Port** |
| People directory (search, team filter, who handles what) | Missing | **Port** (Northshore sample file) |
| Lookup tables (holidays, pay dates, benefits, EAP) readable by Ask | Missing | **Port** (Northshore sample file) |
| Skip link, labels, answer live region | Partially present | **Port** remaining a11y behavior |
| Dialog focus trapping | Missing | **Port** |
| Meridian Works handbook, people, tables, names | N/A | **Skip** (do not copy demo content) |
| Insights tab (unanswered / downvoted questions) | Missing | **Skip** (needs shared storage) |
| `claude.use`, `sample.json`, db/user editor permissions | Missing | **Skip** (Claude artifact runtime) |
| Thorough-mode checkbox tied to Claude token cost | N/A | **Port** as a "read whole handbook" toggle when a key exists; no-key still uses retrieve |
| Org chart visualization | Missing | **Skip** (awkward without a graphics library; directory is enough) |
| Mailto send from drafted email | Missing | **Port** as a mailto link (simplest) |
| Grouped multi-week checklist from demo | Single first-week list | **Skip** extra grouping UI; keep one list and add due dates |
| Starter-question chips from demo handbook | Four chips on Ask | Keep existing chips |
| Multi-language crisis regexes in demo | English-only keywords | **Port** the demo regexes (behavior, not content) |
