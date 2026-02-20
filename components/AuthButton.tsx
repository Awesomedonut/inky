"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-teal-200">{session.user.name}</span>
        <button
          onClick={() => signOut()}
          className="hover:text-teal-200 underline underline-offset-2"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="hover:text-teal-200 text-sm"
    >
      Sign in with Google
    </button>
  );
}
