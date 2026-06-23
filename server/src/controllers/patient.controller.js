import Queue from "../models/queue.model.js";
import Session from "../models/session.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";

// Verify OTP to get patient tracking ID
export const verifyOtp = wrapAsync(async (req, res, next) => {
  const { code } = req.body;

  if (!code || code.trim().length !== 4) {
    throw new ExpressError(400, "A valid 4-digit OTP code is required.");
  }

  // Find all queues that have a patient with this code
  // Sort by createdAt descending to get the most recent ones first
  const queues = await Queue.find({ "patients.code": code })
    .populate("sessionId")
    .sort({ createdAt: -1 });

  if (!queues || queues.length === 0) {
    throw new ExpressError(404, "Invalid OTP or Patient not found.");
  }

  // Find the queue that belongs to an active session
  const activeQueue = queues.find((q) => q.sessionId && q.sessionId.status === "active");

  if (!activeQueue) {
    throw new ExpressError(404, "No active session found for this OTP. The session might have ended.");
  }

  // Find the specific patient in the active queue
  const patient = activeQueue.patients.find((p) => p.code === code);

  if (!patient) {
    throw new ExpressError(404, "Patient not found in the active queue.");
  }

  res.status(200).json({
    success: true,
    message: "OTP verified successfully.",
    trackingId: patient._id, // This is the automatically generated MongoDB _id
  });
});

// Get patient session and queue details by trackingId
export const getPatientSession = wrapAsync(async (req, res, next) => {
  const { trackingId } = req.params;

  if (!trackingId) {
    throw new ExpressError(400, "Tracking ID is required.");
  }

  // Find the queue that contains this patient
  const queue = await Queue.findOne({ "patients._id": trackingId }).populate({
    path: "sessionId",
    populate: {
      path: "doctorId",
      select: "fullName clinicName profileImage",
    },
  });

  if (!queue) {
    throw new ExpressError(404, "Session or patient not found.");
  }

  const patient = queue.patients.find((p) => p._id.toString() === trackingId);

  if (!patient) {
    throw new ExpressError(404, "Patient not found.");
  }

  res.status(200).json({
    success: true,
    patient,
    queue: {
      _id: queue._id,
      estimatedWaitTime: queue.estimatedWaitTime,
      currentToken: queue.currentToken,
      patients: queue.patients.map(p => ({
        // We only send safe data to the frontend for other patients to calculate queue position if needed
        _id: p._id,
        tokenNumber: p.tokenNumber,
        skipped: p.skipped,
        joinedAt: p.joinedAt,
        consultationStartedAt: p.consultationStartedAt,
        consultationEndedAt: p.consultationEndedAt,
      })),
    },
    session: queue.sessionId,
  });
});
