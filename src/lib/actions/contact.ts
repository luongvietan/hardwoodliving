"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/actions";

// Re-export for consumers
export type { ActionResult } from "@/lib/types/actions";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().max(30, "Phone number is too long").optional().or(z.literal("")),
  product_interest: z.string().max(200, "Product interest is too long").optional().or(z.literal("")),
  room_type: z.string().max(100, "Room type is too long").optional().or(z.literal("")),
  area: z.string().max(50, "Area is too long").optional().or(z.literal("")),
  budget: z.string().max(50, "Budget is too long").optional().or(z.literal("")),
  message: z.string().max(2000, "Message is too long (max 2000 characters)").optional().or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/** Convenience alias for the contact form action result. */
export type ContactActionResult = ActionResult<{ message: string }>;

// ---------------------------------------------------------------------------
// Server Action — submit contact/consultation form to Supabase
// ---------------------------------------------------------------------------
export async function submitContactForm(
  prevState: ContactActionResult | null,
  formData: FormData,
): Promise<ContactActionResult> {
  // 1. Extract raw form data
  const raw = {
    name: (formData.get("name") as string) ?? "",
    email: (formData.get("email") as string) ?? "",
    phone: (formData.get("phone") as string) ?? "",
    product_interest: (formData.get("product_interest") as string) ?? "",
    room_type: (formData.get("room_type") as string) ?? "",
    area: (formData.get("area") as string) ?? "",
    budget: (formData.get("budget") as string) ?? "",
    message: (formData.get("message") as string) ?? "",
  };

  // 2. Server-side validation with zod
  const result = contactFormSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  // 3. Insert into Supabase `inquiries` table
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("inquiries").insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      product_interest: result.data.product_interest || null,
      room_type: result.data.room_type || null,
      area: result.data.area || null,
      budget: result.data.budget || null,
      message: result.data.message || null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        success: false,
        error: "Something went wrong. Please try again or contact us directly.",
      };
    }

    return {
      success: true,
      data: { message: "Thank you for your inquiry! We'll be in touch within 1-2 business days." },
    };
  } catch (error) {
    console.error("Unexpected error submitting contact form:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again or contact us directly.",
    };
  }
}
