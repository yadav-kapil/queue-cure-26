import express from "express";
import { addPatient, leaveSession } from "../controllers/rec.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { addPatientSchemaValidation } from "../validator/patient.validator.js";

const recRouter = express.Router();

recRouter.post("/add-patient", authenticate, validate(addPatientSchemaValidation), addPatient);
recRouter.post("/leave-session", authenticate, leaveSession);

export default recRouter;
