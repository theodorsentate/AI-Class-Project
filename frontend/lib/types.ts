export type Article = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  body: string;
};

export type RankedHit = {
  article: Article;
  score: number;
};

export type CompanyProfile = {
  name: string;
  industry: string;
  peopleEmail: string;
  itEmail: string;
  ethicsHotline: string;
  buddyName: string;
  workHours: string;
};

export type ChecklistItem = {
  id: string;
  title: string;
  detail: string;
  owner: "You" | "IT" | "People Ops";
};

export type AssistantReply = {
  text: string;
  sources: string[];
  escalate: boolean;
  sensitive: boolean;
  mode: "handbook" | "llm";
};
