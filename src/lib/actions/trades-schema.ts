/**
 * Zod schemas and TypeScript types for trade actions.
 * Kept in a separate file (no "use server") so they can be imported
 * by both server actions and client components without triggering
 * Next.js's "use server file can only export async functions" error.
 */

import { z } from "zod";
import type { ActionResult } from "@/lib/types/actions";

export const tradeRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  company: z.string().min(1, "Company name is required").max(200, "Company name is too long"),
  business_type: z.string().min(1, "Business type is required").max(100, "Business type is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().max(30, "Phone number is too long").optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type TradeRegistrationData = z.infer<typeof tradeRegistrationSchema>;

export const tradeLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type TradeLoginData = z.infer<typeof tradeLoginSchema>;

/** Convenience alias for trade registration result. */
export type TradeRegistrationResult = ActionResult<{ message: string; redirectTo?: string }>;

/** Convenience alias for trade login result. */
export type TradeLoginResult = ActionResult<{ message: string; redirectTo: string }>;
