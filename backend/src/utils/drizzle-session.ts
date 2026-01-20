import { AgentInputItem, Session } from '@openai/agents';
import { desc, eq } from 'drizzle-orm';
import db from '../config/database';
import { conversationsTable, messagesTable } from '../config/schema';

export class DrizzleSession implements Session {
    private conversationId?: string;
    private agentName: string;
    private userId?: string;

    constructor(agentName: string, conversationId?: string, userId?: string) {
        this.agentName = agentName;
        this.conversationId = conversationId;
        this.userId = userId;
    }

    async getSessionId(): Promise<string> {
        const id = await this.getOrCreateConversationId();
        return id.toString();
    }

    private async getOrCreateConversationId(): Promise<number> {
        if (this.conversationId) {
            const id = parseInt(this.conversationId);
            if (!isNaN(id)) {
                const [conversation] = await db.select()
                    .from(conversationsTable)
                    .where(eq(conversationsTable.id, id))
                    .limit(1);
                if (conversation) return conversation.id;
            }
        }

        if (!this.userId) {
            throw new Error(`Conversation not found for conversationId ${this.conversationId} and no userId provided to create one.`);
        }

        const [newConversation] = await db.insert(conversationsTable).values({
            userId: this.userId,
            agent: this.agentName,
        }).returning({ id: conversationsTable.id });

        this.conversationId = newConversation.id.toString();
        return newConversation.id;
    }

    async getItems(limit?: number): Promise<AgentInputItem[]> {
        const conversationId = await this.getOrCreateConversationId();
        const rows = await db.select()
            .from(messagesTable)
            .where(eq(messagesTable.conversationId, conversationId))
            .orderBy(messagesTable.id);

        let items = rows.map(r => r.item as unknown as AgentInputItem).filter(item => item !== null);

        // If limit is provided, return only the last 'limit' items
        if (limit !== undefined && limit > 0) {
            const start = Math.max(items.length - limit, 0);
            items = items.slice(start);
        }

        return items;
    }

    async addItems(items: AgentInputItem[]): Promise<void> {
        if (items.length === 0) return;

        const conversationId = await this.getOrCreateConversationId();

        await db.insert(messagesTable).values(
            items.map(item => ({
                conversationId,
                item: item as any,
            }))
        );
    }

    async popItem(): Promise<AgentInputItem | undefined> {
        const conversationId = await this.getOrCreateConversationId();
        const lastItems = await db.select()
            .from(messagesTable)
            .where(eq(messagesTable.conversationId, conversationId))
            .orderBy(desc(messagesTable.id))
            .limit(1);

        if (lastItems.length === 0) return undefined;

        const lastItem = lastItems[0];

        await db.delete(messagesTable)
            .where(eq(messagesTable.id, lastItem.id));

        return lastItem.item as unknown as AgentInputItem;
    }

    async clearSession(): Promise<void> {
        const conversationId = await this.getOrCreateConversationId();
        await db.delete(messagesTable)
            .where(eq(messagesTable.conversationId, conversationId));
    }
}
