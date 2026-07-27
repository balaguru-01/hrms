const mongoose = require("mongoose");
const validator = require("validator");

const tenantSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    companyCode: {
      type: String,
      required: [true, "Company code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Company email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email",
      },
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    website: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return !value || validator.isURL(value);
        },
        message: "Invalid website URL",
      },
    },

    logo: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },

    subscription: {
      plan: {
        type: String,
        enum: ["Free", "Basic", "Premium", "Enterprise"],
        default: "Free",
      },

      status: {
        type: String,
        enum: ["Trial", "Active", "Expired", "Suspended"],
        default: "Trial",
      },

      startDate: Date,

      endDate: Date,
    },

    employeeLimit: {
      type: Number,
      default: 10,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

tenantSchema.index({ companyCode: 1 });
tenantSchema.index({ email: 1 });
module.exports = mongoose.model("Tenant", tenantSchema);