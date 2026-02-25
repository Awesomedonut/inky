import { NextRequest, NextResponse } from "next/server";
import { getWork, updateWork, deleteWork, getChaptersForWork, sanitizeWork } from "@/lib/store";
import { verifyEditToken } from "@/lib/auth-helpers";

const ALLOWED_UPDATE_FIELDS = ["title", "author", "summary", "rating", "fandoms", "relationships", "characters", "freeforms"];

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
  return NextResponse.json({ work: sanitizeWork(work), chapters });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { editToken, ...updates } = body;

  const result = await verifyEditToken(id, editToken);
  if (!result.ok) return result.response;

  const allowedUpdates: Record<string, unknown> = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (key in updates) {
      allowedUpdates[key] = updates[key];
    }
  }

  const updated = await updateWork(id, allowedUpdates);
  if (!updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ work: sanitizeWork(updated) });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const result = await verifyEditToken(id, body.editToken);
  if (!result.ok) return result.response;

  await deleteWork(id);
  return NextResponse.json({ success: true });
}
