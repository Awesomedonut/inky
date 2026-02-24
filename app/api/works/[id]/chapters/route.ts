import { NextRequest, NextResponse } from "next/server";
import { getWork, createChapter, recalcWorkStats, hashToken } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { editToken, title, body: chapterBody, format } = body;

  if (!editToken) {
    return NextResponse.json({ error: "Edit token required" }, { status: 401 });
  }

  const work = await getWork(id);
  if (!work) {
    return NextResponse.json({ error: "Work not found" }, { status: 404 });
  }

  if (hashToken(editToken) !== work.editToken) {
    return NextResponse.json({ error: "Invalid edit token" }, { status: 403 });
  }

  if (!chapterBody?.trim()) {
    return NextResponse.json(
      { error: "Chapter content is required" },
      { status: 400 }
    );
  }
  if (format && format !== "rich_text" && format !== "html") {
    return NextResponse.json({ error: "Invalid chapter format" }, { status: 400 });
  }

  const chapter = await createChapter(id, chapterBody, title, format || "rich_text");
  await recalcWorkStats(id);

  return NextResponse.json({ chapter }, { status: 201 });
}
