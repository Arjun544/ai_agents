import { relations } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";


export const conversationsTable = pgTable("conversations", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id").notNull(),
    agent: text("agent").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messagesTable = pgTable("messages", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    conversationId: integer("conversation_id").notNull().references(() => conversationsTable.id),
    item: jsonb("item"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversationsRelations = relations(conversationsTable, ({ many }) => ({
    messages: many(messagesTable),
}));

export const messagesRelations = relations(messagesTable, ({ one }) => ({
    conversation: one(conversationsTable, {
        fields: [messagesTable.conversationId],
        references: [conversationsTable.id],
    }),
}));
