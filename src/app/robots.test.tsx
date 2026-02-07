import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("returns valid robots configuration", () => {
    const result = robots();

    expect(result).toBeDefined();
    expect(result.rules).toBeDefined();
  });

  it("allows crawling of root path", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const mainRule = rules[0];

    expect(mainRule?.allow).toContain("/");
  });

  it("disallows crawling of admin and API routes", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const mainRule = rules[0];
    const disallowed = mainRule?.disallow;

    expect(disallowed).toContain("/admin");
    expect(disallowed).toContain("/api");
  });

  it("includes sitemap URL", () => {
    const result = robots();

    expect(result.sitemap).toBeDefined();
    expect(result.sitemap).toContain("/sitemap.xml");
  });

  it("applies rules to all user agents", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const mainRule = rules[0];

    expect(mainRule?.userAgent).toBe("*");
  });
});
