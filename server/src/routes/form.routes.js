import express from "express";
import * as formController from "../controllers/form.controller.js";

const router = express.Router();

router.post("/", formController.postForm);

export default router;
