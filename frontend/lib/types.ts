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
  hireName?: string;
  hireRole?: string;
  logoUrl?: string;
  accent?: string;
};

export type ChecklistItem = {
  id: string;
  title: string;
  detail: string;
  owner: "You" | "IT" | "People Ops" | "Your manager" | "Sales Enablement" | "RevOps";
  dueBusinessDay?: number;
  /** Handbook article that explains this task. */
  articleId?: string;
  /** Email-help topic that drafts a note about this task. */
  askTopic?: string;
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
