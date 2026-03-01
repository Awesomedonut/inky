"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (session?.user) {
    return (
      <div id="greeting">
        <ul className="user actions">
          <li><span>{session.user.name}</span></li>
          <li>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              Log Out
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div id="login" className="dropdown">
      <p className="user actions">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            signIn("google");
          }}
        >
          Log In
        </button>
      </p>
    </div>
  );
}
