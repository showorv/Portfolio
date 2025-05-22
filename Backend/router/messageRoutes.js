import express from "express"
import { createMessage } from "../controllers/messageController.js";
import { getAllMessage } from "../controllers/messageController.js";
import { deleteMessage } from "../controllers/messageController.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router()

router.post("/send",createMessage )
router.get("/getMessage", getAllMessage)
router.delete("/deleteMessage/:id", isAuthenticated,deleteMessage)

export default router;