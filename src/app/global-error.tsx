"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body style={{ background: "#ffffff", color: "#171717" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
            background: "#ffffff",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#dc2626",
            }}
          >
            Critical Error
          </p>
          <h1
            style={{
              marginTop: "0.5rem",
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Something Went Wrong
          </h1>
          <p
            style={{
              marginTop: "1rem",
              maxWidth: "28rem",
              fontSize: "1.125rem",
              color: "#4b5563",
            }}
          >
            A critical error occurred. Please try refreshing the page.
          </p>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "0.75rem",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              onClick={reset}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "0.375rem",
                backgroundColor: "#b45309",
                color: "white",
                fontWeight: 600,
                fontSize: "0.875rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "0.375rem",
                backgroundColor: "white",
                color: "#111827",
                fontWeight: 600,
                fontSize: "0.875rem",
                border: "1px solid #d1d5db",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
