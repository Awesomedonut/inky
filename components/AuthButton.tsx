"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (session?.user) {
    return (
      <div className="auth-area">
        <span className="auth-name">{session.user.name}</span>
        <button
          type="button"
          className="auth-btn"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="auth-btn"
      onClick={(e) => {
        e.preventDefault();
        signIn("google");
      }}
    >
      Log In
    </button>
  );
}
