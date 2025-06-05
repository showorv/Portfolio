import express from "express"
import { forgotPassword, getPortfolioProfile, register, resetPassword, updatePassword } from "../controllers/userControllers.js";
import { login } from "../controllers/userControllers.js";
import { logout } from "../controllers/userControllers.js";
import { isAuthenticated } from "../middleware/auth.js";
import { getUser } from "../controllers/userControllers.js";
import { updateUser } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.get("/logout",isAuthenticated,logout)
router.get("/me",isAuthenticated,getUser)
router.put("/update/me", isAuthenticated, updateUser)
router.put("/update/password", isAuthenticated, updatePassword)
router.get("/me/portfolio",  getPortfolioProfile)
router.post("/password/forgot",  forgotPassword)
router.put("/password/reset/:token",  resetPassword)
export default router;