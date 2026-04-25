import { pgTable, text, timestamp, uuid, date, uniqueIndex, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const horoscopesTable = pgTable(
  "horoscopes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sign: text("sign").notNull(),
    date: date("date").notNull(),
    overview: text("overview").notNull(),
    love: text("love").notNull(),
    career: text("career").notNull(),
    health: text("health").notNull(),
    finance: text("finance").notNull(),
    luckyNumber: integer("lucky_number").notNull(),
    luckyColor: text("lucky_color").notNull(),
    luckyTime: text("lucky_time").notNull(),
    mood: text("mood").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    signDateUnique: uniqueIndex("horoscopes_sign_date_unique").on(t.sign, t.date),
  })
);

export const insertHoroscopeSchema = createInsertSchema(horoscopesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertHoroscope = z.infer<typeof insertHoroscopeSchema>;
export type Horoscope = typeof horoscopesTable.$inferSelect;
