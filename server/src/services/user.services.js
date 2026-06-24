import User from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";

// 1. Receptionist requesting Doctor
export const requestAssociationAsReceptionist = async (receptionistId, doctorId) => {
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== "doctor") {
    throw new ExpressError(404, "Doctor not found");
  }

  return await User.findByIdAndUpdate(
    receptionistId,
    {
      associatedDoctorId: doctorId,
      associationStatus: "pending",
    },
    { new: true }
  ).select("-password").populate("associatedDoctorId", "-password");
};

// 2. Doctor requesting Receptionist
export const requestAssociationAsDoctor = async (doctorId, receptionistId) => {
  const receptionist = await User.findById(receptionistId);
  if (!receptionist || receptionist.role !== "receptionist") {
    throw new ExpressError(404, "Receptionist not found");
  }

  return await User.findByIdAndUpdate(
    doctorId,
    {
      associatedReceptionistId: receptionistId,
      associationStatus: "pending",
    },
    { new: true }
  ).select("-password").populate("associatedReceptionistId", "-password");
};

// 3. Doctor handling Receptionist's request (accept/reject)
export const handleAssociationRequestAsDoctor = async (doctorId, receptionistId, action) => {
  const receptionist = await User.findById(receptionistId);
  if (!receptionist || receptionist.role !== "receptionist") {
    throw new ExpressError(404, "Receptionist not found");
  }

  const doctor = await User.findById(doctorId);

  if (action === "accept") {
    if (doctor.associatedReceptionistId && doctor.associationStatus === "active") {
      throw new ExpressError(400, "You already have an active receptionist");
    }

    if (receptionist.associationStatus === "active") {
      throw new ExpressError(400, "This receptionist is already active with another doctor");
    }

    await User.findByIdAndUpdate(receptionistId, {
      associatedDoctorId: doctorId,
      associationStatus: "active",
    });

    return await User.findByIdAndUpdate(
      doctorId,
      {
        associatedReceptionistId: receptionistId,
        associationStatus: "active",
      },
      { new: true }
    ).select("-password").populate("associatedReceptionistId", "-password");

  } else if (action === "reject") {
    await User.findByIdAndUpdate(receptionistId, {
      associationStatus: "rejected",
    });
    return await User.findById(doctorId).select("-password").populate("associatedReceptionistId", "-password");
  }
};

// 4. Receptionist handling Doctor's request (accept/reject)
export const handleAssociationRequestAsReceptionist = async (receptionistId, doctorId, action) => {
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== "doctor") {
    throw new ExpressError(404, "Doctor not found");
  }

  const receptionist = await User.findById(receptionistId);

  if (action === "accept") {
    if (receptionist.associatedDoctorId && receptionist.associationStatus === "active") {
      throw new ExpressError(400, "You already have an active doctor");
    }

    if (doctor.associationStatus === "active") {
      throw new ExpressError(400, "This doctor is already active with another receptionist");
    }

    await User.findByIdAndUpdate(doctorId, {
      associatedReceptionistId: receptionistId,
      associationStatus: "active",
    });

    return await User.findByIdAndUpdate(
      receptionistId,
      {
        associatedDoctorId: doctorId,
        associationStatus: "active",
      },
      { new: true }
    ).select("-password").populate("associatedDoctorId", "-password");

  } else if (action === "reject") {
    await User.findByIdAndUpdate(doctorId, {
      associationStatus: "rejected",
    });
    return await User.findById(receptionistId).select("-password").populate("associatedDoctorId", "-password");
  }
};

// Fetch pending requests sent to a doctor
export const getAssociationRequestsForDoctor = async (doctorId) => {
  return await User.find({
    role: "receptionist",
    associatedDoctorId: doctorId,
    associationStatus: "pending",
  }).select("fullName username role email mobileNumber profileImage");
};

// Fetch pending requests sent to a receptionist
export const getAssociationRequestsForReceptionist = async (receptionistId) => {
  return await User.find({
    role: "doctor",
    associatedReceptionistId: receptionistId,
    associationStatus: "pending",
  }).select("fullName username role email mobileNumber profileImage clinicName");
};

// Cancel pending request sent by receptionist
export const cancelAssociationRequestAsReceptionist = async (receptionistId) => {
  const receptionist = await User.findById(receptionistId);
  if (!receptionist || receptionist.associationStatus !== "pending") {
    throw new ExpressError(400, "No pending request to cancel");
  }

  return await User.findByIdAndUpdate(
    receptionistId,
    {
      associatedDoctorId: null,
      associationStatus: "none",
    },
    { new: true }
  ).select("-password").populate("associatedDoctorId", "-password");
};

// Cancel pending request sent by doctor
export const cancelAssociationRequestAsDoctor = async (doctorId) => {
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.associationStatus !== "pending") {
    throw new ExpressError(400, "No pending request to cancel");
  }

  return await User.findByIdAndUpdate(
    doctorId,
    {
      associatedReceptionistId: null,
      associationStatus: "none",
    },
    { new: true }
  ).select("-password").populate("associatedReceptionistId", "-password");
};

// Remove active receptionist from doctor
export const removeAssociationAsDoctor = async (doctorId) => {
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.associationStatus !== "active" || !doctor.associatedReceptionistId) {
    throw new ExpressError(400, "No active receptionist to remove");
  }

  const receptionistId = doctor.associatedReceptionistId;

  await User.findByIdAndUpdate(receptionistId, {
    associatedDoctorId: null,
    associationStatus: "none",
  });

  return await User.findByIdAndUpdate(
    doctorId,
    {
      associatedReceptionistId: null,
      associationStatus: "none",
    },
    { new: true }
  ).select("-password").populate("associatedReceptionistId", "-password");
};

// Remove active doctor from receptionist
export const removeAssociationAsReceptionist = async (receptionistId) => {
  const receptionist = await User.findById(receptionistId);
  if (!receptionist || receptionist.associationStatus !== "active" || !receptionist.associatedDoctorId) {
    throw new ExpressError(400, "No active doctor to remove");
  }

  const doctorId = receptionist.associatedDoctorId;

  await User.findByIdAndUpdate(doctorId, {
    associatedReceptionistId: null,
    associationStatus: "none",
  });

  return await User.findByIdAndUpdate(
    receptionistId,
    {
      associatedDoctorId: null,
      associationStatus: "none",
    },
    { new: true }
  ).select("-password").populate("associatedDoctorId", "-password");
};
