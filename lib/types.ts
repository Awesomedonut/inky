export interface Work {
  id: string;
  title: string;
  author: string;
  summary: string;
  rating: "General" | "Teen" | "Mature" | "Explicit" | "Not Rated";
  fandoms: string[];
  relationships: string[];
  characters: string[];
  freeforms: string[];
  editToken: string; // stored as SHA-256 hash
  wordCount: number;
  chapterCount: number;
  kudosCount: number;
  hitCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  workId: string;
  title: string;
  body: string;
  format: "rich_text" | "html";
  position: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  workId: string;
  name: string;
  body: string;
  createdAt: string;
}

export type TagType = "fandoms" | "relationships" | "characters" | "freeforms";

export const RATINGS = [
  "Not Rated",
  "General",
  "Teen",
  "Mature",
  "Explicit",
] as const;
