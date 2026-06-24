import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const formatUserResponse = (user) => {
  if (!user) return null;
  return {
    id: user._id || user.id,
    _id: user._id || user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    mobileNumber: user.mobileNumber,
    profileImage: user.profileImage,
    clinicName: user.clinicName,
    associatedDoctorId: user.associatedDoctorId,
    associatedReceptionistId: user.associatedReceptionistId,
    associationStatus: user.associationStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const sendTokenResponse = async (user, statusCode, res) => {
  const token = generateToken(user);

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    signed: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  let populatedUser = user;
  if (user && typeof user.populate === "function") {
    populatedUser = await user.populate([
      { path: "associatedDoctorId", select: "-password" },
      { path: "associatedReceptionistId", select: "-password" },
    ]);
  }

  res.status(statusCode).json({
    success: true,
    user: formatUserResponse(populatedUser),
  });
};
