import jwt from "jsonwebtoken";
import config from "../config/config.js";

// TOKEN
export const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: "1d",
  });
};

