import { COOKIE_NAME } from "@shared/const";
import { Resend } from "resend";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const contactSchema = z.object({
  name:         z.string().min(1).max(200),
  email:        z.string().email().max(320),
  organization: z.string().min(1).max(200),
  role:         z.string().max(200).optional(),
  interest:     z.string().max(100).optional(),
  message:      z.string().max(5000).optional(),
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(contactSchema)
      .mutation(async ({ input }) => {
        if (!ENV.resendApiKey) {
          console.warn("[contact] RESEND_API_KEY not set — skipping email send");
          return { success: true };
        }

        const resend = new Resend(ENV.resendApiKey);

        const interestLabel = input.interest
          ? {
              compute:     "Compute Infrastructure",
              power:       "Power & Energy",
              airgapped:   "Air-Gapped Deployments",
              sovereign:   "Sovereign AI Capability",
              partnership: "Partnership / Investment",
              other:       "Other",
            }[input.interest] ?? input.interest
          : "Not specified";

        const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
  <h2 style="margin-bottom:4px">New enquiry via galadora.com</h2>
  <p style="color:#666;margin-top:0;font-size:13px">Submitted ${new Date().toUTCString()}</p>
  <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;width:140px">Full Name</td><td style="padding:8px 0;border-bottom:1px solid #eee">${input.name}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555">Work Email</td><td style="padding:8px 0;border-bottom:1px solid #eee"><a href="mailto:${input.email}">${input.email}</a></td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555">Organization</td><td style="padding:8px 0;border-bottom:1px solid #eee">${input.organization}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555">Role</td><td style="padding:8px 0;border-bottom:1px solid #eee">${input.role || "—"}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555">Area of Interest</td><td style="padding:8px 0;border-bottom:1px solid #eee">${interestLabel}</td></tr>
    <tr><td style="padding:8px 0;color:#555;vertical-align:top">Message</td><td style="padding:8px 0;white-space:pre-wrap">${input.message || "—"}</td></tr>
  </table>
  <p style="margin-top:24px;font-size:12px;color:#999">Galadora Technologies · galadora.com</p>
</div>`;

        const { error } = await resend.emails.send({
          from:    "Galadora Website <noreply@galadora.com>",
          to:      [ENV.contactToEmail],
          replyTo: input.email,
          subject: `New enquiry from ${input.name} — ${input.organization}`,
          html,
        });

        if (error) {
          console.error("[contact] Resend error:", error);
          throw new Error("Failed to send message. Please try again.");
        }

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
