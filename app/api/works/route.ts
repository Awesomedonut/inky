import { NextRequest, NextResponse } from "next/server";
import { getWorks, createWork } from "@/lib/store";
import { RATINGS } from "@/lib/types";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tag = searchParams.get("tag");
  const q = searchParams.get("q");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  let works = await getWorks();

  // Sort by most recent first
  works.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Filter by tag
  if (tag) {
    const tagLower = tag.toLowerCase();
    works = works.filter(
      (w) =>
        w.fandoms.some((t) => t.toLowerCase() === tagLower) ||
        w.relationships.some((t) => t.toLowerCase() === tagLower) ||
        w.characters.some((t) => t.toLowerCase() === tagLower) ||
        w.freeforms.some((t) => t.toLowerCase() === tagLower)
    );
  }

  // Search by title/summary
  if (q) {
    const qLower = q.toLowerCase();
    works = works.filter(
      (w) =>
        w.title.toLowerCase().includes(qLower) ||
        w.summary.toLowerCase().includes(qLower) ||
        w.author.toLowerCase().includes(qLower)
    );
  }

  const total = works.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated = works.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Strip editToken from results
  const sanitized = paginated.map(({ editToken: _, ...rest }) => rest);

  return NextResponse.json({
    works: sanitized,
    page,
    totalPages,
    total,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    title,
    author,
    summary,
    rating,
    fandoms,
    relationships,
    characters,
    freeforms,
    chapterBody,
    chapterTitle,
    chapterFormat,
  } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!chapterBody?.trim()) {
    return NextResponse.json({ error: "Chapter content is required" }, { status: 400 });
  }
  if (rating && !RATINGS.includes(rating)) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }
  if (chapterFormat && chapterFormat !== "rich_text" && chapterFormat !== "html") {
    return NextResponse.json({ error: "Invalid chapter format" }, { status: 400 });
  }

  const { work, chapter, rawToken } = await createWork(
    {
      title: title.trim(),
      author: (author || "Anonymous").trim(),
      summary: (summary || "").trim(),
      rating: rating || "Not Rated",
      fandoms: fandoms || [],
      relationships: relationships || [],
      characters: characters || [],
      freeforms: freeforms || [],
    },
    chapterBody,
    chapterTitle,
    chapterFormat || "rich_text"
  );

  // Return the work without the hashed token, but with the raw token
  const { editToken: _, ...sanitizedWork } = work;

  return NextResponse.json(
    { work: sanitizedWork, chapter, editToken: rawToken },
    { status: 201 }
  );
}
