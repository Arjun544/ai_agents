import express, { Router } from "express";
import { z } from "zod";
import { personalController } from "../controllers/personal";

const router = Router();

// Validation schema
const chatBodySchema = z.object({
    message: z.string().optional(),
    socketId: z.string().optional(),
});

// Validation middleware
const validateChatBody = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        chatBodySchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
                success: false,
            });
        }
        next(error);
    }
};

router.post("/chat", validateChatBody, personalController.chat);

export { router as personalRoutes };

