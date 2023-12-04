import synchroniseController from "../controllers/SynchronizationController";
import express from "express";
const router = express.Router();

router.get("/", synchroniseController.synchronise);

export default router;