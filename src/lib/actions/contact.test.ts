import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock Supabase
// ---------------------------------------------------------------------------
const mockInsert = vi.fn();
const mockFrom = vi.fn(() => ({ insert: mockInsert }));
const mockCreateClient = vi.fn(() => Promise.resolve({ from: mockFrom }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => mockCreateClient(),
}));

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------
import { submitContactForm, contactFormSchema } from "./contact";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

const validFormData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "(604) 555-0123",
  product_interest: "Oak Flooring",
  room_type: "Living Room",
  area: "500",
  budget: "$5,000 - $15,000",
  message: "Interested in hardwood flooring for my living room.",
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("contactFormSchema", () => {
  it("validates a complete valid form", () => {
    const result = contactFormSchema.safeParse(validFormData);
    expect(result.success).toBe(true);
  });

  it("requires name", () => {
    const result = contactFormSchema.safeParse({ ...validFormData, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe("name");
    }
  });

  it("requires email", () => {
    const result = contactFormSchema.safeParse({ ...validFormData, email: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe("email");
    }
  });

  it("validates email format", () => {
    const result = contactFormSchema.safeParse({ ...validFormData, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("valid email");
    }
  });

  it("allows optional fields to be empty strings", () => {
    const result = contactFormSchema.safeParse({
      name: "John",
      email: "john@example.com",
      phone: "",
      product_interest: "",
      room_type: "",
      area: "",
      budget: "",
      message: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name over 100 characters", () => {
    const result = contactFormSchema.safeParse({ ...validFormData, name: "A".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejects message over 2000 characters", () => {
    const result = contactFormSchema.safeParse({ ...validFormData, message: "A".repeat(2001) });
    expect(result.success).toBe(false);
  });
});

describe("submitContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockResolvedValue({ error: null });
  });

  it("returns ActionResult with success: true and data.message on valid submission", async () => {
    const fd = makeFormData(validFormData);
    const result = await submitContactForm(null, fd);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toContain("Thank you");
    }
  });

  it("inserts correct data into Supabase inquiries table", async () => {
    const fd = makeFormData(validFormData);
    await submitContactForm(null, fd);

    expect(mockFrom).toHaveBeenCalledWith("inquiries");
    expect(mockInsert).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      phone: "(604) 555-0123",
      product_interest: "Oak Flooring",
      room_type: "Living Room",
      area: "500",
      budget: "$5,000 - $15,000",
      message: "Interested in hardwood flooring for my living room.",
    });
  });

  it("returns field errors (string[]) when name is missing", async () => {
    const fd = makeFormData({ ...validFormData, name: "" });
    const result = await submitContactForm(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.name).toBeDefined();
      expect(Array.isArray(result.fieldErrors?.name)).toBe(true);
      expect(result.fieldErrors!.name[0]).toBe("Name is required");
    }
  });

  it("returns field errors (string[]) when email is invalid", async () => {
    const fd = makeFormData({ ...validFormData, email: "bad-email" });
    const result = await submitContactForm(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.email).toBeDefined();
      expect(Array.isArray(result.fieldErrors?.email)).toBe(true);
    }
  });

  it("returns ActionResult with error string when Supabase insert fails", async () => {
    mockInsert.mockResolvedValue({ error: { message: "Database error" } });

    const fd = makeFormData(validFormData);
    const result = await submitContactForm(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Something went wrong");
    }
  });

  it("returns ActionResult with error string when Supabase throws an exception", async () => {
    mockCreateClient.mockRejectedValueOnce(new Error("Connection failed"));

    const fd = makeFormData(validFormData);
    const result = await submitContactForm(null, fd);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Something went wrong");
    }
  });

  it("stores null for empty optional fields", async () => {
    const fd = makeFormData({
      name: "Jane",
      email: "jane@example.com",
      phone: "",
      product_interest: "",
      room_type: "",
      area: "",
      budget: "",
      message: "",
    });

    await submitContactForm(null, fd);

    expect(mockInsert).toHaveBeenCalledWith({
      name: "Jane",
      email: "jane@example.com",
      phone: null,
      product_interest: null,
      room_type: null,
      area: null,
      budget: null,
      message: null,
    });
  });

  it("preserves form data when validation fails (no Supabase call)", async () => {
    const fd = makeFormData({ ...validFormData, name: "" });
    await submitContactForm(null, fd);

    expect(mockFrom).not.toHaveBeenCalled();
    expect(mockInsert).not.toHaveBeenCalled();
  });
});
