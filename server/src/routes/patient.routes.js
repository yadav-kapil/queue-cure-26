import express from "express";
import * as patientController from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/verify-otp", patientController.verifyOtp);
router.get("/track/:trackingId", patientController.getPatientSession);

export default router;
