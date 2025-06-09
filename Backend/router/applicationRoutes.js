import express from "express"
import {  postApplication, deleteApplication, getApplication } from "../controllers/applicationController.js"
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post("/add",isAuthenticated, postApplication)
router.delete("/delete/:id",isAuthenticated, deleteApplication)
router.get("/getAll", getApplication)

export default router;