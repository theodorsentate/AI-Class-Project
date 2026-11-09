import { describe, expect, it } from "vitest";
import { classify, eapFromHandbook, isInformational } from "./safety";

const shouldTrigger = [
  "I want to kill myself",
  "I don't want to be alive",
  "I wish I were dead",
  "I am thinking about ending it all",
  "There is no point in living",
  "I would be better off dead",
  "I can't go on",
  "I am tired of being alive",
  "I don't see the point anymore",
  "I took too many pills",
  "I keep having dark thoughts",
  "Nobody would miss me",
  "I want it all to stop",
  "I am going to sleep forever",
  "I hate myself and I want to disappear",
  "My manager keeps harassing me",
  "He yelled at me and won't leave me alone",
  "I was denied a promotion because I am a woman",
  "I do not feel safe at work",
  "Someone shoved me in the hallway",
  "I think I need therapy after what happened here",
  "They are stealing wages and it is illegal",
  "I got hurt at work and need an accommodation",
];

const shouldNot = [
  "What is the harassment policy?",
  "How do I report harassment?",
  "Explain the code of conduct",
  "How does parental leave work?",
  "What benefits cover mental health counseling?",
  "When is payroll?",
  "How do I request time off?",
  "Who do I ask about pay?",
  "Can you tell me how to enroll in benefits?",
  "What happens if I miss a timesheet?",
  "How do I turn on multi-factor authentication?",
  "Where is the handbook section on emergencies?",
  "Is the office closed on holidays?",
  "How do I find the ethics hotline number?",
  "What should I do on my first day?",
  "Tell me about hybrid work",
  "Which email do I use for IT lockouts?",
  "Do I have to go to my manager for benefits questions?",
];

describe("classify", () => {
  it("treats crisis and personal harm reports as sensitive", () => {
    for (const phrase of shouldTrigger) {
      expect(classify(phrase), phrase).not.toBeNull();
    }
  });

  it("leaves informational policy questions alone", () => {
    for (const phrase of shouldNot) {
      expect(classify(phrase), phrase).toBeNull();
    }
  });

  it("marks self-harm language as crisis", () => {
    expect(classify("I wish I were dead")?.crisis).toBe(true);
  });
});

describe("isInformational", () => {
  it("detects policy questions", () => {
    expect(isInformational("What is the harassment policy?")).toBe(true);
  });
});

describe("eapFromHandbook", () => {
  it("reads the EAP number from the Northshore handbook", () => {
    expect(eapFromHandbook()?.phone).toMatch(/800/);
  });
});
