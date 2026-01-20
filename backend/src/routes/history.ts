import { Router } from "express";
import { historyController } from "../controllers/history";

const router = Router();

router.get("/conversations", historyController.getConversations);
router.get("/messages", historyController.getMessages);

export { router as historyRoutes };