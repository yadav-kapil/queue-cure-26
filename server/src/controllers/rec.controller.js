import Session from "../models/session.model.js";
import Queue from "../models/queue.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";

// Add a patient to the active session queue
export const addPatient = wrapAsync(async (req, res, next) => {
  if (req.user.role !== "receptionist") {
    throw new ExpressError(403, "Access denied. Only receptionists can add patients.");
  }

  const associatedDoctorId = req.user.associatedDoctorId
    ? (req.user.associatedDoctorId._id || req.user.associatedDoctorId)
    : null;

  if (!associatedDoctorId) {
    throw new ExpressError(400, "No associated doctor found. Please connect with a doctor first.");
  }

  const session = await Session.findOne({
    doctorId: associatedDoctorId,
    status: "active",
  });

  if (!session) {
    throw new ExpressError(404, "No active session found for the associated doctor.");
  }

  const queue = await Queue.findOne({ sessionId: session._id });
  if (!queue) {
    throw new ExpressError(404, "Queue not found for this session.");
  }

  const { name, mobile, age, gender } = req.body;
  if (!name || !mobile) {
    throw new ExpressError(400, "Patient name and mobile number are required.");
  }

  // Generate next token number starting at 1023 or incrementing the last token number in the queue
  let nextToken = 1;
  if (queue.patients && queue.patients.length > 0) {
    const lastPatient = queue.patients[queue.patients.length - 1];
    nextToken = lastPatient.tokenNumber + 1;
  }

  // Generate 4-digit random OTP
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  const newPatient = {
    tokenNumber: nextToken,
    name,
    mobile,
    age: age ? Number(age) : undefined,
    gender,
    code,
    joinedAt: new Date(),
  };

  queue.patients.push(newPatient);
  await queue.save();

  // Broadcast to all clients in the session room using socket.io
  const io = req.app.get("io");
  if (io) {
    io.to(session._id.toString()).emit("queue-updated", { queue });
  }

  res.status(201).json({
    success: true,
    message: "Patient added to the queue successfully.",
    patient: newPatient,
    queue,
  });
});

// Leave the active session
export const leaveSession = wrapAsync(async (req, res, next) => {
  if (req.user.role !== "receptionist") {
    throw new ExpressError(403, "Access denied. Only receptionists can leave a session.");
  }

  const associatedDoctorId = req.user.associatedDoctorId
    ? (req.user.associatedDoctorId._id || req.user.associatedDoctorId)
    : null;

  if (!associatedDoctorId) {
    throw new ExpressError(400, "No associated doctor found.");
  }

  const session = await Session.findOneAndUpdate(
    { doctorId: associatedDoctorId, status: "active" },
    { receptionistId: null },
    { new: true }
  );

  if (session) {
    // Broadcast receptionist left event to the room
    const io = req.app.get("io");
    if (io) {
      io.to(session._id.toString()).emit("receptionist-left", { receptionistId: req.user._id });
    }
  }

  res.status(200).json({
    success: true,
    message: "Left session successfully.",
    session,
  });
});
