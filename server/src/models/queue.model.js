import mongoose from "mongoose";

const patientSubSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    consultationStartedAt: {
      type: Date,
    },
    consultationEndedAt: {
      type: Date,
    },
    skipped: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const queueSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      unique: true,
      index: true,
    },
    estimatedWaitTime: {
      type: Number,
      default: 0,
    },
    currentToken: {
      type: Number,
      default: 0,
    },
    currentTokenStartedAt: {
      type: Date,
    },
    patients: [patientSubSchema],
  },
  {
    timestamps: true,
  }
);

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;
