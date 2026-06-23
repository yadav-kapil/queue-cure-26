import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { sendTokenResponse, formatUserResponse } from "../utils/jwtHelper.js";
import {
  requestAssociationAsReceptionist,
  requestAssociationAsDoctor,
  handleAssociationRequestAsDoctor,
  handleAssociationRequestAsReceptionist,
  getAssociationRequestsForDoctor,
  getAssociationRequestsForReceptionist,
  cancelAssociationRequestAsReceptionist,
  cancelAssociationRequestAsDoctor,
  removeAssociationAsDoctor,
  removeAssociationAsReceptionist
} from "../services/user.services.js";

// register
export const register = wrapAsync(async (req, res, next) => {
  const {
    fullName,
    username,
    email,
    mobileNumber,
    role,
    password,
    clinicName,
    profileImage,
  } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ExpressError(400, "Email is already registered");
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ExpressError(400, "Username is already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullName,
    username,
    email,
    mobileNumber,
    role,
    password: hashedPassword,
    clinicName: clinicName || "",
    profileImage: profileImage || "",
  });

  await sendTokenResponse(newUser, 201, res);
});

// login
export const login = wrapAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ExpressError(401, "Invalid email or password");
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ExpressError(401, "Invalid email or password");
  }

  await sendTokenResponse(user, 200, res);
});

// logout
export const logout = wrapAsync(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    signed: true,
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// get me
export const getMe = wrapAsync((req, res) => {
  res.status(200).json({
    success: true,
    user: formatUserResponse(req.user),
  });
});

// request association (bi-directional: doctor to receptionist, or receptionist to doctor)
export const requestAssociation = wrapAsync(async (req, res, next) => {
  const { targetUserId } = req.body;

  if (!targetUserId) {
    throw new ExpressError(400, "Target user ID is required");
  }

  let updatedUser;
  switch (req.user.role) {
    case "receptionist":
      updatedUser = await requestAssociationAsReceptionist(req.user._id, targetUserId);
      break;
    case "doctor":
      updatedUser = await requestAssociationAsDoctor(req.user._id, targetUserId);
      break;
    default:
      throw new ExpressError(403, "Invalid user role");
  }

  res.status(200).json({
    success: true,
    user: formatUserResponse(updatedUser),
  });
});

// accept/reject request (bi-directional: doctor handles receptionist, or receptionist handles doctor)
export const handleAssociationRequest = wrapAsync(async (req, res, next) => {
  const { targetUserId, action } = req.body;

  if (!targetUserId || !action) {
    throw new ExpressError(400, "Target user ID and action are required");
  }

  if (!["accept", "reject"].includes(action)) {
    throw new ExpressError(400, "Invalid action. Must be 'accept' or 'reject'");
  }

  let updatedUser;
  switch (req.user.role) {
    case "doctor":
      updatedUser = await handleAssociationRequestAsDoctor(req.user._id, targetUserId, action);
      break;
    case "receptionist":
      updatedUser = await handleAssociationRequestAsReceptionist(req.user._id, targetUserId, action);
      break;
    default:
      throw new ExpressError(403, "Invalid user role");
  }

  res.status(200).json({
    success: true,
    user: formatUserResponse(updatedUser),
  });
});

// search users by username and role
export const searchUsers = wrapAsync(async (req, res, next) => {
  const { username, role } = req.body;

  if (!role) {
    throw new ExpressError(400, "Role is required for search");
  }

  if (!username || username.trim().length < 3) {
    throw new ExpressError(400, "Username search query must be at least 3 characters long");
  }

  const users = await User.find({
    role,
    username: { $regex: username.trim(), $options: "i" },
    associationStatus: { $ne: "active" },
  }).select("fullName username role email mobileNumber profileImage clinicName");

  res.status(200).json({
    success: true,
    users,
  });
});

// get pending requests for logged-in user
export const getAssociationRequests = wrapAsync(async (req, res, next) => {
  let requests;

  switch (req.user.role) {
    case "doctor":
      requests = await getAssociationRequestsForDoctor(req.user._id);
      break;
    case "receptionist":
      requests = await getAssociationRequestsForReceptionist(req.user._id);
      break;
    default:
      throw new ExpressError(403, "Invalid user role");
  }

  res.status(200).json({
    success: true,
    requests,
  });
});

// cancel pending request sent by logged-in user
export const cancelAssociationRequest = wrapAsync(async (req, res, next) => {
  let updatedUser;

  switch (req.user.role) {
    case "receptionist":
      updatedUser = await cancelAssociationRequestAsReceptionist(req.user._id);
      break;
    case "doctor":
      updatedUser = await cancelAssociationRequestAsDoctor(req.user._id);
      break;
    default:
      throw new ExpressError(403, "Invalid user role");
  }

  res.status(200).json({
    success: true,
    user: formatUserResponse(updatedUser),
  });
});

// remove active association (disconnect)
export const removeAssociation = wrapAsync(async (req, res, next) => {
  let updatedUser;

  switch (req.user.role) {
    case "doctor":
      updatedUser = await removeAssociationAsDoctor(req.user._id);
      break;
    case "receptionist":
      updatedUser = await removeAssociationAsReceptionist(req.user._id);
      break;
    default:
      throw new ExpressError(403, "Invalid user role");
  }

  res.status(200).json({
    success: true,
    user: formatUserResponse(updatedUser),
  });
});

// update profile (fullName, mobileNumber, clinicName)
export const updateProfile = wrapAsync(async (req, res, next) => {
  const { fullName, mobileNumber, clinicName } = req.body;

  if (!fullName || !fullName.trim()) {
    throw new ExpressError(400, "Full name is required");
  }

  if (!mobileNumber || !mobileNumber.trim()) {
    throw new ExpressError(400, "Mobile number is required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      clinicName: (clinicName || "").trim(),
    },
    { new: true, runValidators: true }
  ).populate([
    { path: "associatedDoctorId", select: "-password" },
    { path: "associatedReceptionistId", select: "-password" },
  ]);

  if (!updatedUser) {
    throw new ExpressError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: formatUserResponse(updatedUser),
  });
});

// change password
export const changePassword = wrapAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ExpressError(400, "Current password and new password are required");
  }

  if (newPassword.length < 6) {
    throw new ExpressError(400, "New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ExpressError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new ExpressError(400, "Current password is incorrect");
  }

  if (currentPassword === newPassword) {
    throw new ExpressError(400, "New password must be different from current password");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});
