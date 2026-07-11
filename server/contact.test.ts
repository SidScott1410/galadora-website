import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  it("rejects invalid email with a validation error", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "not-an-email",
        organization: "Acme",
      })
    ).rejects.toThrow();
  });

  it("accepts valid input and returns success (live Resend call)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.contact.submit({
      name: "Manus Test",
      email: "test@galadora.com",
      organization: "Galadora Technologies",
      role: "Automated Test",
      interest: "compute",
      message: "This is an automated test submission from the Manus build pipeline. Please ignore.",
    });
    expect(result).toEqual({ success: true });
  }, 15_000);
});
