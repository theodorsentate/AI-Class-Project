import { articles } from "./knowledge";

export const CRISIS =
  /suicid|self[- ]?harm|kill(ing)? (my)?self|end(ing)? (it all|my life)|take my (own )?life|(want|wanna|wish|thinking|thought)s?\b.{0,24}\b(die|dead|disappear|not (be )?(here|alive)|end it)|don'?t want to (be alive|live|be here|exist|wake up)|no (reason|point) (to|in) (live|living|going on|anything)|better off (dead|without me|if i (was|were) gone|if i disappear)|(hurt|hurting|harm|harming|cut|cutting|injure|injuring) (my ?self)|dark thoughts|hate myself|overdos|took too many (pills|tablets)|swallowed (pills|tablets)|worthless|can'?t (go on|do this anymore|take it anymore)|never wake up|go(ing)? to sleep (forever|and never)|end(ing)? things|don'?t see (the )?(point|reason)|what'?s the point|(nobody|no one) (would )?(care|miss)|wish i (was|were) (dead|gone|never born)|tired of (living|life|being alive)|give up on (life|everything)|not be around|can'?t keep (doing|going)( this| like this)?|want it (all )?to (stop|end)|i(?:'m| am) done with (life|everything)/i;

export const SENSITIVE: [string, RegExp][] = [
  [
    "harassment",
    /harass\w*|assault\w*|molest\w*|\bgrop(e|ed|ing)\b|hostile (work|environment)|\bbull(y|ies|ied|ying)\b|stalk\w*|won'?t (leave me alone|stop)|(screams?|yells?|shouts?) at me|humiliat\w*|retaliat\w*|keeps? (touching|staring|following|texting)/i,
  ],
  [
    "discrimination",
    /discriminat\w*|racis\w*|sexis\w*|homophob\w*|transphob\w*|unequal pay|passed over (because|for)|whistle\w*|denied (me )?(a )?(promotion|raise)/i,
  ],
  [
    "safety",
    /\bunsafe|(don'?t|do not|not) feel safe|\bnot safe\b|scared (to|of|for)|afraid (to|of|for)|threat\w*|violen\w*|\babus\w*|weapon\w*|\b(hit|punched|slapped|shoved|pushed|kicked|attacked) (me|him|her|someone)\b/i,
  ],
  [
    "mental_health",
    /(panic|anxiety) attacks?|depress\w*|hopeless|helpless|burn(ed|t)?[- ]?out|mental health (crisis|emergency|struggle)|breaking point|think i need (help|therapy)/i,
  ],
  [
    "medical",
    /need (an? )?(accommodation|adjustment)s?\b|\bi'?m pregnant|medical (condition|leave|emergency)|hurt (at|on) work|injured (at|on) work/i,
  ],
  [
    "legal",
    /\blawyer|\battorney|lawsuit|\bsue\b|wrongful\w*|unfair(ly)? (dismiss\w*|terminat\w*|fired)|wage theft|unpaid (wages|overtime)|\billegal\b|\bfraud\b/i,
  ],
];

const EXPERIENCE =
  /\b(my (manager|boss|supervisor|coworker|colleague)|he|she|they|someone|(made|makes|told|sent|touched|threatened|hit) (me|my)|i (am|was|got|feel|felt|have been|keep|can'?t|don'?t)|i'?m|i'?ve)\b/i;
const QWORD =
  /^\s*(what|how|where|who|when|why|does|do|is|are|can|could|should|will|which|tell me|explain)\b/i;
const HYPO = /\b(if (i|someone|a coworker|an employee)|in case|what happens (if|when))\b/i;
const INFO_LEAD =
  /\b(i'?m (trying|looking) to (figure out|find out|understand)|i (just )?want to (learn|know|understand)|can you (tell|explain|help me (find|understand)))\b/i;
const FILLER =
  /^\s*(?:(?:hey|hi|hello|ok|okay|so|quick q|quick question|question|um|uh|please|pls|just)\b[\s,:!.-]*)+/i;

export type SafetyHit = {
  cat: string;
  crisis: boolean;
};

export function isInformational(text: string): boolean {
  if (CRISIS.test(text)) {
    return false;
  }
  const core = text.replace(FILLER, "");
  const asks = QWORD.test(core) || INFO_LEAD.test(core);
  if (!asks) {
    return false;
  }
  return !EXPERIENCE.test(core.replace(INFO_LEAD, "")) || HYPO.test(core);
}

export function classify(text: string): SafetyHit | null {
  const s = String(text || "");
  if (CRISIS.test(s)) {
    return { cat: "mental_health", crisis: true };
  }
  if (isInformational(s)) {
    return null;
  }
  for (const [cat, re] of SENSITIVE) {
    if (re.test(s)) {
      return { cat, crisis: false };
    }
  }
  return null;
}

export function eapFromHandbook(): { name: string; phone: string } | null {
  const blob = articles.map((article) => article.body).join("\n");
  const match = blob.match(/EAP[^0-9]{0,80}(1[-.\s]?800[-.\s]?\d{3}[-.\s]?\d{4})/i);
  if (!match) {
    return null;
  }
  return { name: "Employee Assistance Program", phone: match[1] };
}

export type SupportLink = { label: string; href: string; detail: string };

export function resourcesBlock(crisis: boolean): SupportLink[] {
  const items: SupportLink[] = [
    {
      label: "United States: call or text 988",
      href: "tel:988",
      detail: "988 Suicide and Crisis Lifeline. Free, 24/7.",
    },
  ];
  const eap = eapFromHandbook();
  if (eap) {
    items.unshift({
      label: `${eap.name}: ${eap.phone}`,
      href: `tel:${eap.phone.replace(/[^+0-9]/g, "")}`,
      detail: "Free and confidential for you and your household.",
    });
  }
  if (!crisis) {
    items.push({
      label: "Send a confidential note to People Ops",
      href: "/escalate",
      detail: "Your manager is not copied.",
    });
  }
  return items;
}
