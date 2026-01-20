import db from "../config/database";
import { conversationsTable, messagesTable } from "../config/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from 'express';


export const historyController = {
    getConversations: async (req: Request, res: Response) => {
        try {
            const body = req.body as { userId: string };
            console.log(body);
            const userId = body.userId;
            if (!userId) {
                return res.status(400).json({
                    message: 'User ID is required',
                    success: false,
                });
            }

            const history = await db.select().from(conversationsTable).where(eq(conversationsTable.userId, userId));
            return res.json({
                history,
                success: true,
            });
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : String(error);
            return res.status(500).json({
                message: 'An error occurred while processing your request.',
                error: errorMessage,
                success: false,
            });
        }
    },
    getMessages: async (req: Request, res: Response) => {
        try {
            const body = req.query as { id: string };
            console.log(body);
            const id = body.id;
            if (!id) {
                return res.status(400).json({
                    message: 'ID is required',
                    success: false,
                });
            }

            const history = await db.select().from(messagesTable).where(eq(messagesTable.conversationId, id as unknown as number));
            return res.json({
                history,
                success: true,
            });
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : String(error);
            return res.status(500).json({
                message: 'An error occurred while processing your request.',
                error: errorMessage,
                success: false,
            });
        }
    }
}