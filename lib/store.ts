import { readFile, writeFile, rename, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";
import { Work, Chapter, Comment, TagType, TAG_TYPES, SanitizedWork } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const WORKS_FILE = "works.json";
const CHAPTERS_FILE = "chapters.json";
const COMMENTS_FILE = "comments.json";

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJSON<T>(filename: string): Promise<T[]> {
  await ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  try {
    const raw = await readFile(filepath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeJSON<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  const tmp = filepath + ".tmp." + crypto.randomUUID();
  await writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8");
  await rename(tmp, filepath);
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function sanitizeWork(work: Work): SanitizedWork {
  const { editToken: _, ...sanitized } = work;
  return sanitized;
}

export function workMatchesTag(work: Work, tag: string): boolean {
  const tagLower = tag.toLowerCase();
  return TAG_TYPES.some((type) =>
    work[type].some((t) => t.toLowerCase() === tagLower)
  );
}

function countWords(text: string): number {
  const stripped = text.replace(/<[^>]*>/g, " ");
  const words = stripped.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

// --- Works ---

export async function getWorks(): Promise<Work[]> {
  return readJSON<Work>(WORKS_FILE);
}

export async function getWork(id: string): Promise<Work | undefined> {
  const works = await getWorks();
  return works.find((w) => w.id === id);
}

export async function createWork(
  data: Omit<Work, "id" | "editToken" | "wordCount" | "chapterCount" | "kudosCount" | "hitCount" | "createdAt" | "updatedAt">,
  chapterBody: string,
  chapterTitle?: string,
  chapterFormat: "rich_text" | "html" = "rich_text"
): Promise<{ work: Work; chapter: Chapter; rawToken: string }> {
  const works = await getWorks();
  const rawToken = crypto.randomUUID();
  const now = new Date().toISOString();

  const work: Work = {
    id: crypto.randomUUID(),
    ...data,
    editToken: hashToken(rawToken),
    wordCount: countWords(chapterBody),
    chapterCount: 1,
    kudosCount: 0,
    hitCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  works.push(work);
  await writeJSON(WORKS_FILE, works);

  const chapter = await createChapter(work.id, chapterBody, chapterTitle, chapterFormat);

  return { work, chapter, rawToken };
}

export async function updateWork(
  id: string,
  data: Partial<Omit<Work, "id" | "editToken" | "createdAt">>
): Promise<Work | undefined> {
  const works = await getWorks();
  const idx = works.findIndex((w) => w.id === id);
  if (idx === -1) return undefined;

  works[idx] = {
    ...works[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await writeJSON(WORKS_FILE, works);
  return works[idx];
}

export async function deleteWork(id: string): Promise<boolean> {
  const works = await getWorks();
  const idx = works.findIndex((w) => w.id === id);
  if (idx === -1) return false;

  works.splice(idx, 1);
  await writeJSON(WORKS_FILE, works);

  // Delete associated chapters and comments
  const chapters = await getChapters();
  await writeJSON(
    CHAPTERS_FILE,
    chapters.filter((c) => c.workId !== id)
  );

  const comments = await getComments();
  await writeJSON(
    COMMENTS_FILE,
    comments.filter((c) => c.workId !== id)
  );

  return true;
}

export async function recalcWorkStats(workId: string): Promise<void> {
  const chapters = await getChaptersForWork(workId);
  const wordCount = chapters.reduce((sum, ch) => sum + countWords(ch.body), 0);
  await updateWork(workId, { wordCount, chapterCount: chapters.length });
}

async function incrementWorkCounter(
  workId: string,
  field: "kudosCount" | "hitCount"
): Promise<number | undefined> {
  const works = await getWorks();
  const idx = works.findIndex((w) => w.id === workId);
  if (idx === -1) return undefined;
  works[idx][field] = (works[idx][field] || 0) + 1;
  await writeJSON(WORKS_FILE, works);
  return works[idx][field];
}

export async function incrementKudos(workId: string): Promise<number | undefined> {
  return incrementWorkCounter(workId, "kudosCount");
}

export async function incrementHits(workId: string): Promise<number | undefined> {
  return incrementWorkCounter(workId, "hitCount");
}

// --- Chapters ---

export async function getChapters(): Promise<Chapter[]> {
  const chapters = await readJSON<Chapter>(CHAPTERS_FILE);
  return chapters.map((chapter) => ({
    ...chapter,
    format: chapter.format || "rich_text",
  }));
}

export async function getChaptersForWork(workId: string): Promise<Chapter[]> {
  const chapters = await getChapters();
  return chapters
    .filter((c) => c.workId === workId)
    .sort((a, b) => a.position - b.position);
}

export async function getChapter(id: string): Promise<Chapter | undefined> {
  const chapters = await getChapters();
  return chapters.find((c) => c.id === id);
}

export async function createChapter(
  workId: string,
  body: string,
  title?: string,
  format: "rich_text" | "html" = "rich_text"
): Promise<Chapter> {
  const chapters = await getChapters();
  const workChapters = chapters.filter((c) => c.workId === workId);
  const position = workChapters.length + 1;

  const chapter: Chapter = {
    id: crypto.randomUUID(),
    workId,
    title: title || "",
    body,
    format,
    position,
    createdAt: new Date().toISOString(),
  };

  chapters.push(chapter);
  await writeJSON(CHAPTERS_FILE, chapters);

  return chapter;
}

// --- Comments ---

export async function getComments(): Promise<Comment[]> {
  return readJSON<Comment>(COMMENTS_FILE);
}

export async function getCommentsForWork(workId: string): Promise<Comment[]> {
  const comments = await getComments();
  return comments
    .filter((c) => c.workId === workId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function createComment(
  workId: string,
  name: string,
  body: string
): Promise<Comment> {
  const comments = await getComments();

  const comment: Comment = {
    id: crypto.randomUUID(),
    workId,
    name,
    body,
    createdAt: new Date().toISOString(),
  };

  comments.push(comment);
  await writeJSON(COMMENTS_FILE, comments);

  return comment;
}

// --- Tags ---

export async function getAllTags(): Promise<Record<TagType, string[]>> {
  const works = await getWorks();
  const tagSets = Object.fromEntries(
    TAG_TYPES.map((type) => [type, new Set<string>()])
  ) as Record<TagType, Set<string>>;

  for (const work of works) {
    for (const type of TAG_TYPES) {
      work[type].forEach((t) => tagSets[type].add(t));
    }
  }

  return Object.fromEntries(
    TAG_TYPES.map((type) => [type, [...tagSets[type]].sort()])
  ) as Record<TagType, string[]>;
}
