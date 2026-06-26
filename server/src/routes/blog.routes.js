import express from "express";
import * as blogController from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);

export default router;
