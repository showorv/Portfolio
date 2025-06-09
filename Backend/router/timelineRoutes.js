import express from "express"
import { deleteTimeline, getTimeline, postTimeline } from "../controllers/timelineController.js"
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post("/add",isAuthenticated, postTimeline)
router.delete("/delete/:id",isAuthenticated, deleteTimeline)
router.get("/getAll",isAuthenticated, getTimeline)

export default router;