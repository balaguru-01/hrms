const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      trim: true,
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

    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
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

permissionSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Permission", permissionSchema);