import express from "express"
import {  postSkill, deleteSkill, updateSkill, getSkill} from "../controllers/skillController.js"
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post("/add",isAuthenticated,postSkill)
router.delete("/delete/:id",isAuthenticated, deleteSkill)
router.put("/update/:id",isAuthenticated, updateSkill)
router.get("/getAll", getSkill)

export default router;