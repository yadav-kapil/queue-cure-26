import Session from "../models/session.model.js";
import Queue from "../models/queue.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";

// Call the next patient in the queue
export const callNext = wrapAsync(async (req, res, next) => {
  if (req.user.role !== "doctor") {
    throw new ExpressError(403, "Access denied. Only doctors can perform this action.");
  }

  const session = await Session.findOne({ doctorId: req.user._id, status: "active" });
  if (!session) {
    throw new ExpressError(404, "No active session found.");
  }

  const queue = await Queue.findOne({ sessionId: session._id });
  if (!queue) {
    throw new ExpressError(404, "Queue not found for this session.");
  }

  // 1. If there's an active patient, automatically mark them as skipped
  if (queue.currentToken && queue.currentToken > 0) {
    const activePatient = queue.patients.find((p) => p.tokenNumber === queue.currentToken);
    if (activePatient && !activePatient.consultationEndedAt) {
      activePatient.skipped = true;
      activePatient.consultationEndedAt = new Date();
    }
  }

  // 2. Find the next waiting patient in the queue
  const nextPatient = queue.patients.find(
    (p) => !p.consultationStartedAt && !p.consultationEndedAt && !p.skipped
  );

  if (!nextPatient) {
    throw new ExpressError(400, "No waiting patients in the queue.");
  }

  // 3. Start consultation for the next patient
  nextPatient.consultationStartedAt = new Date();
  queue.currentToken = nextPatient.tokenNumber;
  queue.currentTokenStartedAt = new Date();

  await queue.save();

  // Broadcast the queue update
  const io = req.app.get("io");
  if (io) {
    io.to(session._id.toString()).emit("queue-updated", { queue });
  }

  res.status(200).json({
    success: true,
    message: `Called patient #${nextPatient.tokenNumber} successfully.`,
    queue,
  });
});

// Skip the current patient
export const skipPatient = wrapAsync(async (req, res, next) => {
  if (req.user.role !== "doctor") {
    throw new ExpressError(403, "Access denied. Only doctors can perform this action.");
  }

  const session = await Session.findOne({ doctorId: req.user._id, status: "active" });
  if (!session) {
    throw new ExpressError(404, "No active session found.");
  }

  const queue = await Queue.findOne({ sessionId: session._id });
  if (!queue) {
    throw new ExpressError(404, "Queue not found for this session.");
  }

  if (!queue.currentToken || queue.currentToken === 0) {
    throw new ExpressError(400, "No active patient to skip.");
  }

  const activePatient = queue.patients.find((p) => p.tokenNumber === queue.currentToken);
  if (activePatient) {
    activePatient.skipped = true;
    activePatient.consultationEndedAt = new Date();
  }

  queue.currentToken = 0;
  queue.currentTokenStartedAt = null;

  await queue.save();

  // Broadcast the queue update
  const io = req.app.get("io");
  if (io) {
    io.to(session._id.toString()).emit("queue-updated", { queue });
  }

  res.status(200).json({
    success: true,
    message: "Patient marked as skipped successfully.",
    queue,
  });
});

// Mark current patient consultation as completed
export const completePatient = wrapAsync(async (req, res, next) => {
  if (req.user.role !== "doctor") {
    throw new ExpressError(403, "Access denied. Only doctors can perform this action.");
  }

  const session = await Session.findOne({ doctorId: req.user._id, status: "active" });
  if (!session) {
    throw new ExpressError(404, "No active session found.");
  }

  const queue = await Queue.findOne({ sessionId: session._id });
  if (!queue) {
    throw new ExpressError(404, "Queue not found for this session.");
  }

  if (!queue.currentToken || queue.currentToken === 0) {
    throw new ExpressError(400, "No active patient to complete.");
  }

  const activePatient = queue.patients.find((p) => p.tokenNumber === queue.currentToken);
  if (activePatient) {
    activePatient.consultationEndedAt = new Date();
    activePatient.skipped = false;

    if (activePatient.consultationStartedAt) {
      // Calculate duration in minutes, with a minimum of 1 minute to prevent skew
      const durationMs = activePatient.consultationEndedAt.getTime() - activePatient.consultationStartedAt.getTime();
      let durationMins = Number((durationMs / 60000).toFixed(1));
      if (durationMins < 1) durationMins = 1;
      
      queue.averageConsultationTimeArray.push(durationMins);
    }
  }

  queue.currentToken = 0;
  queue.currentTokenStartedAt = null;

  await queue.save();

  // Broadcast the queue update
  const io = req.app.get("io");
  if (io) {
    io.to(session._id.toString()).emit("queue-updated", { queue });
  }

  res.status(200).json({
    success: true,
    message: "Patient consultation marked as completed.",
    queue,
  });
});
