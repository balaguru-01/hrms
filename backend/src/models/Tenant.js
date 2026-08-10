import mongoose from "mongoose";
import validator from "validator";

const tenantSchema = new mongoose.Schema(
    {
        // Organization Information
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

        // Organization Address
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

        // Subscription Information
        subscription: {
            plan: {
                planId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Plan",
                    default: null,
                },

                name: {
                    type: String,
                    trim: true,
                    default: null,
                },

                price: {
                    type: Number,
                    default: 0,
                },

                duration: {
                    type: Number,
                    default: null,
                },

                durationType: {
                    type: String,
                    default: null,
                },
            },

            employeeLimit: {
                type: Number,
                default: 10,
            },

            status: {
                type: String,
                enum: [
                    "Pending",
                    "Active",
                    "Expired",
                    "Suspended",
                    "Rejected",
                ],
                default: "Pending",
            },

            rejectedReason: {
                type: String,
                trim: true,
                default: null,
            },

            subscriptionStartDate: {
                type: Date,
                default: null,
            },

            subscriptionEndDate: {
                type: Date,
                default: null,
            },
        },

        // Audit Information
        createdBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },

            name: {
                type: String,
                required: true,
            },

            role: {
                type: String,
                required: true,
            },
        },

        updatedBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },

            name: {
                type: String,
                default: null,
            },

            role: {
                type: String,
                default: null,
            },
        },

        // Tenant Status
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

export default mongoose.model("Tenant", tenantSchema);