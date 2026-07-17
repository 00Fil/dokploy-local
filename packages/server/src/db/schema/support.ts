import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organization } from "./account";
import { user } from "./user";

export const supportConversation = pgTable(
  "support_conversation",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    requesterId: text("requester_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    status: text("status")
      .notNull()
      .default("open")
      .$type<"open" | "pending" | "closed">(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("supportConversation_organizationId_idx").on(t.organizationId),
    index("supportConversation_requesterId_idx").on(t.requesterId),
    index("supportConversation_updatedAt_idx").on(t.updatedAt),
  ],
);

export const supportMessage = pgTable(
  "support_message",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => supportConversation.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    senderRole: text("sender_role").notNull().$type<"member" | "admin">(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("supportMessage_conversationId_idx").on(t.conversationId),
    index("supportMessage_createdAt_idx").on(t.createdAt),
  ],
);

export const supportConversationRelations = relations(
  supportConversation,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [supportConversation.organizationId],
      references: [organization.id],
    }),
    requester: one(user, {
      fields: [supportConversation.requesterId],
      references: [user.id],
    }),
    messages: many(supportMessage),
  }),
);

export const supportMessageRelations = relations(supportMessage, ({ one }) => ({
  conversation: one(supportConversation, {
    fields: [supportMessage.conversationId],
    references: [supportConversation.id],
  }),
  sender: one(user, {
    fields: [supportMessage.senderId],
    references: [user.id],
  }),
}));

export type SupportConversation = typeof supportConversation.$inferSelect;
export type SupportMessage = typeof supportMessage.$inferSelect;
