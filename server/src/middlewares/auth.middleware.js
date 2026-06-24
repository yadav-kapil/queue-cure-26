import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";
import config from "../config/config.js";
import wrapAsync from "../utils/wrapAsync.js";

export const authenticate = wrapAsync(async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new ExpressError(401, "Authentication required. Please log in.");
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("associatedDoctorId", "-password")
      .populate("associatedReceptionistId", "-password");
    if (!user) {
      throw new ExpressError(401, "User not found or session invalid.");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ExpressError(401, "Invalid or expired token. Please log in again.");
  }
});
