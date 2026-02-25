import { NextRequest, NextResponse } from "next/server";
import { createChapter, recalcWorkStats } from "@/lib/store";
import { verifyEditToken } from "@/lib/auth-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { editToken, title, body: chapterBody, format } = body;

  const result = await verifyEditToken(id, editToken);
  if (!result.ok) return result.response;

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
