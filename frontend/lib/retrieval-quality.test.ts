import { expect, it } from "vitest";
import { articles } from "./knowledge";
import { retrieve } from "./retrieve";
const Q: [string, string][] = [
 ["When do I need to enroll in benefits?","benefits"],["How do I request time off?","time-off"],["I am locked out of my email","it-setup"],
 ["Do I get a laptop and a monitor?","equipment"],["How much is the home office allowance?","equipment"],["How do I get reimbursed for a receipt?","expenses"],
 ["When do I have to submit expenses?","expenses"],["Can I swap shifts with a coworker?","schedules-shifts"],["Do I get a lunch break?","schedules-shifts"],
 ["Is overtime paid if my manager did not approve it?","schedules-shifts"],["What is the dress code?","code-of-conduct"],["Can a vendor give me a gift?","gifts-conflicts"],
 ["Can I have a second job?","gifts-conflicts"],["I got a suspicious email, what do I do?","data-security"],["Can I paste customer data into an AI tool?","data-security"],
 ["Can I post about work on LinkedIn?","social-media"],["A reporter emailed me","social-media"],["How do performance reviews work?","performance-reviews"],
 ["What is the learning budget?","learning"],["Can I apply for another role internally?","internal-moves"],["How does parental leave work?","protected-leave"],
 ["How many bereavement days do I get?","protected-leave"],["I got hurt at work","work-injury"],["Do employees get a discount?","employee-discount"],
 ["How do I give notice and quit?","leaving"],["Who approves business travel?","business-travel"],["What does MFA mean?","glossary"],["What is an EAP?","glossary"],
 ["I disagree with my coworker","disagreements"],["I feel overwhelmed and stressed","wellbeing"],["I lost my badge","building-access"],["Where do I park?","building-access"],
 ["Who do I contact for payroll?","who-to-ask"],["What do I need to do in my first week?","first-day"],["When do I get paid?","pay"],["How do I request an accommodation?","accommodations"],
 ["Can I work from home?","hybrid-work"],["What if there is a fire?","emergency"],["How do I report harassment?","respectful-workplace"],["What happens in the first 90 days?","first-90"],
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
  expect(top1).toBeGreaterThanOrEqual(35);
});
