const mongoose = require("mongoose");
const validator = require("validator");

const tenantSchema = new mongoose.Schema(
  {
    // Organization Name
    orgName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },


    companyCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid Email"],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    website: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "IT",
    },

    // Tenant Address
    address: {
      doorNumber: {
        type: String,
        default: "",
      },

      street: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "India",
      },

      postalCode: {
        type: String,
        default: "",
      },
    },

    //Subscription details
    subscription: {
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        default: null
    },

    status: {
        type: String,
        enum: ["Pending", "Active", "Expired", "Suspended","Rejected"],
        default: "Pending"
    },
    rejectedReason: {
        type: String,
        default: null,
        trim: true
    },

    startDate: {
        type: Date,
        default: null
    },

    endDate: {
        type: Date,
        default: null
    }
},

    employeeLimit: {
        type: Number,
        default: 10
    },

    

    // Audit Information
    createdBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      name: {
        type: String,
      },

      role: {
        type: String,
      },
    },

    isActive: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("Tenant", tenantSchema);