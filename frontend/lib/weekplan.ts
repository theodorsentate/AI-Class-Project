// Sample first-week plan for Lumenfield. Times and meetings are invented for the demo.

export type PlanItem = { time?: string; text: string; with?: string };
export type PlanDay = {
  /** 1 to 5 are single days. 6 covers business days 6 to 10 (week two). */
  day: number;
  label: string;
  title: string;
  blurb: string;
  items: PlanItem[];
};

export const WEEK_PLAN: PlanDay[] = [
  {
    day: 1,
    label: "Day 1",
    title: "Get set up",
    blurb: "Meet the people, get your equipment and get signed in.",
    items: [
      { time: "8:30", text: "Arrive at reception in Austin, or join the video link in your welcome email. Pick up your badge, laptop and headset." },
      { time: "9:00", text: "Welcome and paperwork overview. How pay and benefits work.", with: "Dana Whitfield, People Ops" },
      { time: "10:30", text: "Turn on multi-factor sign-in and check that email and Slack work.", with: "Sam Okafor, IT" },
      { time: "11:30", text: "First 1:1. What the first month looks like and what you are not expected to do yet.", with: "Priya Natarajan, your manager" },
      { time: "13:00", text: "Lunch with your onboarding buddy. Ask anything.", with: "Marcus Hill" },
      { time: "14:30", text: "Product and customer overview.", with: "Leah Brooks, Sales Enablement" },
      { time: "16:30", text: "Write down your three biggest questions and bring them tomorrow." },
    ],
  },
  {
    day: 2,
    label: "Day 2",
    title: "Learn the pitch and the tools",
    blurb: "Listen a lot. You do not carry a quota in your first month.",
    items: [
      { time: "8:45", text: "Mid-Market pod stand-up. Introduce yourself in one sentence." },
      { time: "9:30", text: "CRM walkthrough: accounts, contacts, logging a call.", with: "Tomás Ibarra, RevOps" },
      { time: "11:00", text: "Cadences, templates and the sequencing tool.", with: "Leah Brooks, Sales Enablement" },
      { time: "13:30", text: "Shadow a live call block and take notes.", with: "Marcus Hill" },
      { time: "15:30", text: "Practice your opening line out loud.", with: "Marcus Hill" },
    ],
  },
  {
    day: 3,
    label: "Day 3",
    title: "Rules of the road",
    blurb: "Paperwork is due, and you learn what you can and cannot say.",
    items: [
      { time: "9:00", text: "Hand in your employment eligibility paperwork. You cannot be paid without it.", with: "People Ops" },
      { time: "10:00", text: "Calling, email and recording rules. What you can say to prospects.", with: "Anita Shah, Compliance" },
      { time: "13:00", text: "Shadow two call blocks with different senior SDRs." },
      { time: "16:00", text: "Log what you heard in the CRM, as if the calls were yours." },
    ],
  },
  {
    day: 4,
    label: "Day 4",
    title: "Meet your accounts",
    blurb: "Look at the companies you will work and decide where to start.",
    items: [
      { time: "9:30", text: "Open your account list in the CRM and read up on your top 10 accounts." },
      { time: "11:00", text: "Role-play a discovery call. Swap roles halfway.", with: "Marcus Hill" },
      { time: "13:30", text: "Listen to three calls from the call library that Marcus picks." },
      { time: "15:30", text: "Draft your first email using an approved template and personalize the opening line." },
    ],
  },
  {
    day: 5,
    label: "Day 5",
    title: "Certify and review",
    blurb: "Finish your certification and look back on the week.",
    items: [
      { time: "9:30", text: "CRM and call-tools certification. You need it before you start your own cadences.", with: "Leah Brooks, Sales Enablement" },
      { time: "13:00", text: "Go through your account list and pick the first accounts to start with.", with: "Priya Natarajan" },
      { time: "15:00", text: "Week one review. What worked, what was confusing, and the plan for next week.", with: "Priya Natarajan" },
    ],
  },
  {
    day: 6,
    label: "Week 2",
    title: "Start your first outreach",
    blurb: "Business days 6 to 10. You make your first live calls with a senior SDR next to you. Still no quota.",
    items: [
      { text: "Every day: 8:45 stand-up, then a call block with a senior SDR listening in." },
      { text: "Send your first personalized emails from an approved cadence." },
      { text: "Get one call reviewed with Priya or Marcus. Pick one thing to repeat and one to change." },
      { text: "Decide your benefits before the end of business day 10." },
    ],
  },
];

export const FACTS: { label: string; value: string }[] = [
  { label: "Core hours", value: "Mon to Fri, 8:30 to 17:30 Central" },
  { label: "Where", value: "Austin office Tue to Thu, home Mon and Fri" },
  { label: "Quota", value: "None in month one. Month two: 6 meetings held" },
  { label: "First paycheck", value: "Needs your eligibility paperwork by business day 3" },
  { label: "Free and private help", value: "Ask privately, People Ops, or the EAP at 1-800-555-0199" },
];

/** Which plan day a checklist deadline belongs to. */
export function planDayFor(businessDay: number): number {
  return businessDay >= 6 ? 6 : businessDay;
}
