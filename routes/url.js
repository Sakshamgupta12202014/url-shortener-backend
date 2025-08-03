import express from "express";
import handleURLRoute from "../controllers/url.js"; 
import {getClicks} from "../controllers/url.js"
import authMiddleware from "../authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware,handleURLRoute);
router.get("/analytics/:id", authMiddleware, getClicks);

export default router
