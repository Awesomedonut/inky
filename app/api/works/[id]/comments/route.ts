import { NextRequest, NextResponse } from "next/server";
import { getWork, getCommentsForWork, createComment } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const work = await getWork(id);
  if (!work) {
    return NextResponse.json({ error: "Work not found" }, { status: 404 });
  }

  const comments = await getCommentsForWork(id);
  return NextResponse.json({ comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name, body: commentBody } = body;

  const work = await getWork(id);
  if (!work) {
    return NextResponse.json({ error: "Work not found" }, { status: 404 });
  }

  if (!commentBody?.trim()) {
    return NextResponse.json(
      { error: "Comment body is required" },
      { status: 400 }
    );
  }

  const comment = await createComment(
    id,
    (name || "Anonymous").trim(),
    commentBody.trim()
  );

  return NextResponse.json({ comment }, { status: 201 });
}
