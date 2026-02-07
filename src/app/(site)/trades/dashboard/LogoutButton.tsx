"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutTrade } from "@/lib/actions/trades";

export function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setError(null);
    setPending(true);

    try {
      const result = await logoutTrade();
      if (result.success) {
        router.push("/");
      } else {
        setError(result.error);
      }
    } catch {
      setError("Failed to log out. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        onClick={handleLogout}
        disabled={pending}
        aria-busy={pending}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Logging out…" : "Log Out"}
      </button>
    </div>
  );
}
