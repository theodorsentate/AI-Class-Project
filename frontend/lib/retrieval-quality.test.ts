import { expect, it } from "vitest";
import { articles } from "./knowledge";
import { retrieve } from "./retrieve";
const Q: [string, string][] = [
 ["When do I need to enroll in benefits?","benefits"],["How do I request time off?","time-off"],["I am locked out of my email","it-setup"],
 ["Do I get a laptop and a monitor?","equipment"],["How much is the home office allowance?","equipment"],["How do I get reimbursed for a receipt?","expenses"],
 ["When do I have to submit expenses?","expenses"],["How many dials and emails should I do a day?","daily-rhythm"],["Do I get a lunch break?","daily-rhythm"],
 ["How many meetings do I need to book for quota?","comp-plan"],["What is the dress code?","code-of-conduct"],["Can a vendor give me a gift?","gifts-conflicts"],
 ["Can I have a second job?","gifts-conflicts"],["I got a suspicious email, what do I do?","data-security"],["Can I paste customer data into an AI tool?","data-security"],
 ["Can I post about work on LinkedIn?","social-media"],["A reporter emailed me","social-media"],["How do performance reviews work?","performance-reviews"],
 ["What is the learning budget?","learning"],["Can I apply for another role internally?","internal-moves"],["How does parental leave work?","protected-leave"],
 ["How many bereavement days do I get?","protected-leave"],["I got hurt at work","work-injury"],["Can I quote a price to a prospect?","messaging-rules"],["When does a meeting count as held?","lead-handoff"],["What is the do not call rule?","outreach-rules"],["Can I call a prospect at night?","outreach-rules"],["How long should I take to log a call in the CRM?","crm-hygiene"],["Who owns this account?","icp-territory"],["How do I become an AE?","internal-moves"],["How is commission paid?","comp-plan"],["How many emails are in a cadence?","cadences"],["What happens if a prospect says stop contacting me?","outreach-rules"],["Is my call recorded?","outreach-rules"],["Do I get paid a referral bonus?","referral-bonus"],
 ["How do I give notice and quit?","leaving"],["Who approves business travel?","business-travel"],["What does MFA mean?","glossary"],["What is an EAP?","glossary"],
 ["I disagree with my coworker","disagreements"],["I feel overwhelmed and stressed","wellbeing"],["I lost my badge","building-access"],["Where do I park?","building-access"],
 ["Who do I contact for payroll?","who-to-ask"],["What do I need to do in my first week?","first-day"],["When do I get paid?","pay"],["How do I request an accommodation?","accommodations"],
 ["Can I work from home?","hybrid-work"],["What if there is a fire?","emergency"],["How do I report harassment?","respectful-workplace"],["What happens in the first 90 days?","first-90"],
 ["My manager keeps harassing me","respectful-workplace"],["I was bullied by a coworker","respectful-workplace"],
];
it("finds the right handbook section for everyday questions (no API key)", () => {
  let top1 = 0;
  const missed: string[] = [];
  for (const [q, want] of Q) {
    const ids = retrieve(q, articles, 3).map((h) => h.article.id);
    if (ids[0] === want) top1 += 1;
    if (!ids.includes(want)) missed.push(`${q} -> expected ${want}, got ${ids.join(",") || "nothing"}`);
  }
  expect(missed).toEqual([]);
  expect(top1).toBeGreaterThanOrEqual(40);
});
