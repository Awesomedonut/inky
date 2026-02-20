import { NextRequest, NextResponse } from "next/server";
import { getWork, getCommentsForWork, createComment } from "@/lib/store";
import { auth } from "@/auth";

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
  const { name, body: commentBody, turnstileToken } = body;

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

  const session = await auth();

  let commenterName: string;

  if (session?.user) {
    // Signed-in user: use their Google name, skip captcha
    commenterName = session.user.name || "User";
  } else {
    // Anonymous user: require Turnstile verification
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Captcha verification required" },
        { status: 400 }
      );
    }

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 403 }
      );
    }

    commenterName = (name || "Anonymous").trim();
  }

  const comment = await createComment(id, commenterName, commentBody.trim());

  return NextResponse.json({ comment }, { status: 201 });
}
