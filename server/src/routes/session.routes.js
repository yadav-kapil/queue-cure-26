import express from "express";
import { startSession, getCurrentSession, endSession } from "../controllers/session.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const sessionRouter = express.Router();

sessionRouter.post("/start", authenticate, startSession);
sessionRouter.get("/current", authenticate, getCurrentSession);
sessionRouter.patch("/end", authenticate, endSession);

export default sessionRouter;
