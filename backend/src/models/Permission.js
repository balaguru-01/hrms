const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      lowercase: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "create",
        "read",
        "update",
        "delete",
        "approve",
        "reject",
        "export",
        "manage",
      ],
    },

    permissionName: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Permission", permissionSchema);