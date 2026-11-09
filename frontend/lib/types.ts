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

export type SourceRef = {
  id: string;
  title: string;
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
  sourceRefs: SourceRef[];
  escalate: boolean;
  sensitive: boolean;
  crisis?: boolean;
  category?: string;
  followups?: string[];
  mode: "handbook" | "llm";
};

export type AskRequest = {
  question?: string;
  company?: CompanyProfile;
  startDate?: string;
  doneTitles?: string[];
  openTitles?: string[];
  thorough?: boolean;
  articles?: Article[];
};
