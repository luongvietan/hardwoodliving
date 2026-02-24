"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/actions";
import { rateLimit } from "@/lib/utils/rate-limit";
import {
  tradeRegistrationSchema,
  tradeLoginSchema,
} from "@/lib/actions/trades-schema";
import type { TradeRegistrationResult, TradeLoginResult } from "@/lib/actions/trades-schema";

// ---------------------------------------------------------------------------
// Helper: get client IP for rate limiting
// ---------------------------------------------------------------------------
async function getClientIp(): Promise<string> {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

// ---------------------------------------------------------------------------
// Server Action — register a new trade user
// ---------------------------------------------------------------------------
export async function registerTrade(
  prevState: TradeRegistrationResult | null,
  formData: FormData,
): Promise<TradeRegistrationResult> {
  // Rate limit: 5 registration attempts per minute per IP
  const ip = await getClientIp();
  if (!rateLimit(`register:${ip}`, 5, 60_000)) {
    return {
      success: false,
      error: "Too many registration attempts. Please wait a minute and try again.",
    };
  }

  // 1. Extract raw form data
  const raw = {
    name: (formData.get("name") as string) ?? "",
    company: (formData.get("company") as string) ?? "",
    business_type: (formData.get("business_type") as string) ?? "",
    email: (formData.get("email") as string) ?? "",
    phone: (formData.get("phone") as string) ?? "",
    password: (formData.get("password") as string) ?? "",
  };

  // 2. Validate
  const result = tradeRegistrationSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  // 3. Create auth user in Supabase
  try {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: {
          name: result.data.name,
          company: result.data.company,
          role: "trade",
        },
      },
    });

    if (authError) {
      // Use a generic error message for all auth failures to prevent email enumeration.
      // Do NOT reveal whether the email already exists in the system.
      console.error("Supabase auth error:", authError);
      return {
        success: false,
        error: "Registration could not be completed. If you already have an account, try logging in.",
      };
    }

    // 4. Insert trade profile into trades table
    if (authData.user) {
      const { error: insertError } = await supabase.from("trades").insert({
        id: authData.user.id,
        name: result.data.name,
        company: result.data.company,
        business_type: result.data.business_type,
        email: result.data.email,
        phone: result.data.phone || null,
        status: "pending",
      });

      if (insertError) {
        console.error("Trade profile insert error:", insertError);
        // Don't fail registration if profile insert fails - user can still log in
        // Admin can manually create profile later
      }
    }

    // If Supabase returned a session (email confirmation disabled), redirect to dashboard
    if (authData.session) {
      return {
        success: true,
        data: {
          message: "Registration successful! Redirecting to your dashboard…",
          redirectTo: "/trades/dashboard",
        },
      };
    }

    // Email confirmation required — user must verify before logging in
    return {
      success: true,
      data: {
        message:
          "Registration successful! Please check your email to verify your account, then log in to access the trade dashboard.",
      },
    };
  } catch (error) {
    console.error("Unexpected error during trade registration:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

// ---------------------------------------------------------------------------
// Server Action — log in a trade user
// ---------------------------------------------------------------------------
export async function loginTrade(
  prevState: TradeLoginResult | null,
  formData: FormData,
): Promise<TradeLoginResult> {
  // Rate limit: 10 login attempts per minute per IP
  const ip = await getClientIp();
  if (!rateLimit(`login:${ip}`, 10, 60_000)) {
    return {
      success: false,
      error: "Too many login attempts. Please wait a minute and try again.",
    };
  }

  // 1. Extract raw form data
  const raw = {
    email: (formData.get("email") as string) ?? "",
    password: (formData.get("password") as string) ?? "",
  };

  // 2. Validate
  const result = tradeLoginSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  // 3. Sign in with Supabase
  try {
    const supabase = await createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

    if (authError) {
      return {
        success: false,
        error: "Invalid email or password. Please try again.",
      };
    }

    return {
      success: true,
      data: {
        message: "Login successful!",
        redirectTo: "/trades/dashboard",
      },
    };
  } catch (error) {
    console.error("Unexpected error during trade login:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

// ---------------------------------------------------------------------------
// Server Action — log out a trade user
// ---------------------------------------------------------------------------
export async function logoutTrade(): Promise<ActionResult<{ message: string }>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Supabase sign out error:", error);
      return { success: false, error: "Failed to log out. Please try again." };
    }

    return { success: true, data: { message: "You have been logged out." } };
  } catch (error) {
    console.error("Unexpected error during logout:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
