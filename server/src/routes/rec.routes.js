import express from "express";
import { addPatient, leaveSession } from "../controllers/rec.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const recRouter = express.Router();

recRouter.post("/add-patient", authenticate, addPatient);
recRouter.post("/leave-session", authenticate, leaveSession);

export default recRouter;
