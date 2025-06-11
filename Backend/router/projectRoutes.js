import express from "express"
import { postProject,deleteProject,updateProject, getProject,getSingleProject} from "../controllers/projectController.js"
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post("/add",isAuthenticated, postProject)
router.delete("/delete/:id",isAuthenticated, deleteProject)
router.put("/update/:id",isAuthenticated,updateProject)
router.get("/getAll", getProject)
router.get("/get/:id", getSingleProject)

export default router;