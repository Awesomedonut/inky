import { NextRequest, NextResponse } from "next/server";
import { getWork, updateWork, deleteWork, getChaptersForWork, hashToken } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const work = await getWork(id);
  if (!work) {
    return NextResponse.json({ error: "Work not found" }, { status: 404 });
  }

  const chapters = await getChaptersForWork(id);
  const { editToken: _, ...sanitized } = work;

  return NextResponse.json({ work: sanitized, chapters });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { editToken, ...updates } = body;

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

  // Only allow updating safe fields
  const allowedUpdates: Record<string, unknown> = {};
  const allowed = ["title", "author", "summary", "rating", "fandoms", "relationships", "characters", "freeforms"];
  for (const key of allowed) {
    if (key in updates) {
      allowedUpdates[key] = updates[key];
    }
  }

  const updated = await updateWork(id, allowedUpdates);
  if (!updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  const { editToken: _, ...sanitized } = updated;
  return NextResponse.json({ work: sanitized });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { editToken } = body;

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

  await deleteWork(id);
  return NextResponse.json({ success: true });
}
