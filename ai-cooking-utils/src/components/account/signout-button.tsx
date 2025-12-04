"use client";

import { signOutAction } from "@/server-actions/account";

export function SignoutButton() {
  return (
    <button
      onClick={async () => {
        await signOutAction();
      }}
      type="button"
    >
      Sign Out
    </button>
  );
}
