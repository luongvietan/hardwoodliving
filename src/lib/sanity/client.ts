import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-02-07";

if (!projectId) {
    throw new Error(
        "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID. " +
        "Please check your .env.local file."
    );
}

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: process.env.NODE_ENV === "production",
});
