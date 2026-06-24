import Session from "../models/session.model.js";
import Queue from "../models/queue.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";

// startSession
export const startSession = wrapAsync(async (req, res, next) => {
  if (req.user.role !== "doctor") {
    throw new ExpressError(403, "Access denied. Only doctors can start a session.");
  }

  const doctorId = req.user._id;

  const activeSessionExists = await Session.findOne({
    doctorId,
    status: "active",
  });

  if (activeSessionExists) {
    throw new ExpressError(400, "An active session already exists.");
  }

  const session = await Session.create({
    doctorId,
    receptionistId: null,
    status: "active",
    startedAt: new Date(),
  });

  const queue = await Queue.create({
    sessionId: session._id,
    currentToken: 0,
    estimatedWaitTime: 0,
    patients: [],
  });

  res.status(201).json({
    success: true,
    message: "Session started successfully",
    session,
    queue,
  });
});

// getCurrentSession
export const getCurrentSession = wrapAsync(async (req, res, next) => {
  let session = null;

  if (req.user.role === "doctor") {
    session = await Session.findOne({
      doctorId: req.user._id,
      status: "active",
    }).populate("doctorId receptionistId", "-password");
  } else if (req.user.role === "receptionist") {
    const associatedDoctorId = req.user.associatedDoctorId
      ? (req.user.associatedDoctorId._id || req.user.associatedDoctorId)
      : null;

    session = await Session.findOne({
      doctorId: associatedDoctorId,
      status: "active",
    }).populate("doctorId receptionistId", "-password");
  } else {
    throw new ExpressError(403, "Access denied.");
  }

  if (!session) {
    return res.status(200).json({
      success: true,
      session: null,
      queue: null,
    });
  }

  const queue = await Queue.findOne({
    sessionId: session._id,
  });

  res.status(200).json({
    success: true,
    session,
    queue,
  });
});

// endSession
export const endSession = wrapAsync(async (req, res, next) => {
  if (req.user.role !== "doctor") {
    throw new ExpressError(403, "Access denied. Only doctors can end a session.");
  }

  const session = await Session.findOneAndUpdate(
    { doctorId: req.user._id, status: "active" },
    { status: "ended", endedAt: new Date() },
    { new: true }
  );

  if (!session) {
    throw new ExpressError(404, "No active session found.");
  }

  const io = req.app.get("io");
  if (io) {
    io.to(session._id.toString()).emit("session-ended", { sessionId: session._id });
  }

  res.status(200).json({
    success: true,
    message: "Session ended successfully.",
    session,
  });
});

// getSessionHistory
export const getSessionHistory = wrapAsync(async (req, res, next) => {
  let sessions = [];

  if (req.user.role === "doctor") {
    sessions = await Session.find({
      doctorId: req.user._id,
      status: "ended",
    })
      .populate("receptionistId", "fullName username")
      .sort({ endedAt: -1 });
  } else if (req.user.role === "receptionist") {
    sessions = await Session.find({
      receptionistId: req.user._id,
      status: "ended",
    })
      .populate("doctorId", "fullName username clinicName")
      .sort({ endedAt: -1 });
  } else {
    throw new ExpressError(403, "Access denied.");
  }

  const history = await Promise.all(
    sessions.map(async (session) => {
      const queue = await Queue.findOne({ sessionId: session._id });
      return {
        session,
        queue,
      };
    })
  );

  res.status(200).json({
    success: true,
    history,
  });
});
