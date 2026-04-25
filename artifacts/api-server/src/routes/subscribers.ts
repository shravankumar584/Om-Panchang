import { Router, type IRouter } from "express";
import { db, subscribersTable } from "@workspace/db";
import { SubscribeBody, UnsubscribeQueryParams } from "@workspace/api-zod";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.post("/subscribe", async (req, res) => {
  const rawEmail =
    typeof req.body?.email === "string" ? req.body.email.trim() : req.body?.email;
  const parsed = SubscribeBody.safeParse({ ...req.body, email: rawEmail });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const email = parsed.data.email.toLowerCase();

  try {
    await db
      .insert(subscribersTable)
      .values({ email })
      .onConflictDoUpdate({
        target: subscribersTable.email,
        set: {
          unsubscribedAt: null,
          confirmed: true,
          // Rotate the unsubscribe token on re-subscribe so any previously
          // shared/leaked unsubscribe links stop working.
          unsubscribeToken: sql`gen_random_uuid()`,
        },
      });

    return res.json({
      ok: true,
      message: "Subscribed. You will receive our weekly digest.",
    });
  } catch (err) {
    req.log?.error({ err }, "Failed to subscribe email");
    return res.status(500).json({ error: "Could not subscribe right now." });
  }
});

router.get("/unsubscribe", async (req, res) => {
  const parsed = UnsubscribeQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Missing or invalid token" });
  }

  const token = parsed.data.token;

  try {
    const result = await db
      .update(subscribersTable)
      .set({ unsubscribedAt: new Date() })
      .where(eq(subscribersTable.unsubscribeToken, token))
      .returning({ id: subscribersTable.id });

    if (result.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    return res.json({ ok: true, message: "You have been unsubscribed." });
  } catch (err) {
    req.log?.error({ err }, "Failed to unsubscribe email");
    return res.status(500).json({ error: "Could not unsubscribe right now." });
  }
});

export default router;
