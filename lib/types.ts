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

export const TAG_TYPES: TagType[] = ["fandoms", "relationships", "characters", "freeforms"];

export const RATINGS = [
  "Not Rated",
  "General",
  "Teen",
  "Mature",
  "Explicit",
] as const;

export const RATING_COLORS: Record<string, string> = {
  General: "bg-green-600",
  Teen: "bg-yellow-500",
  Mature: "bg-orange-500",
  Explicit: "bg-red-700",
  "Not Rated": "bg-gray-500",
};

export const TAG_COLORS: Record<TagType, { bg: string; text: string; hover: string }> = {
  fandoms: { bg: "bg-teal-100", text: "text-teal-800", hover: "hover:bg-teal-200" },
  relationships: { bg: "bg-blue-100", text: "text-blue-800", hover: "hover:bg-blue-200" },
  characters: { bg: "bg-green-100", text: "text-green-800", hover: "hover:bg-green-200" },
  freeforms: { bg: "bg-gray-100", text: "text-gray-700", hover: "hover:bg-gray-200" },
};

export type SanitizedWork = Omit<Work, "editToken">;

export function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong";
}
