import { NextRequest, NextResponse } from "next/server";
import { incrementHits } from "@/lib/store";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const hitCount = await incrementHits(id);

  if (hitCount === undefined) {
    return NextResponse.json({ error: "Work not found" }, { status: 404 });
  }

  return NextResponse.json({ hitCount });
}
