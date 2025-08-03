import express from "express";
import {
  handleUserLogin,
  handleUserSignup,
  handleUserLogout,
  handleFetchCurrentUser
} from "../controllers/authControllers.js";
const router = express.Router();

router.post("/login", handleUserLogin);
router.post("/signup", handleUserSignup);
router.get("/logout", handleUserLogout);
router.get("/fetchCurrentUser", handleFetchCurrentUser);

export default router;
