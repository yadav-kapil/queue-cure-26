import express from "express";
import { callNext, skipPatient, completePatient } from "../controllers/doctor.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const doctorRouter = express.Router();

doctorRouter.post("/call-next", authenticate, callNext);
doctorRouter.post("/skip-patient", authenticate, skipPatient);
doctorRouter.post("/complete-patient", authenticate, completePatient);

export default doctorRouter;
