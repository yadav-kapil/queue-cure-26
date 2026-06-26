import Blog from "../models/blog.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";

export const getAllBlogs = wrapAsync(async (req, res, next) => {
  const blogs = await Blog.find().sort({ publishedAt: -1 });
  res.status(200).json({
    success: true,
    data: blogs,
  });
});

export const getBlogById = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ExpressError(404, "Blog post not found");
  }
  res.status(200).json({
    success: true,
    data: blog,
  });
});
