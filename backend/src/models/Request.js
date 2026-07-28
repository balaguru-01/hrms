const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    requestType: {
      type: String,
      enum: [
        "Leave",
        "Permission",
        "Work From Home",
        "On Duty",
        "Overtime"
      ],
      required: true,
    },

    leaveCategory: {
      type: String,
      enum: [
        "Casual",
        "Sick",
        "Earned",
        "Maternity",
        "Paternity"
      ],
      default: null,
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Request", requestSchema);