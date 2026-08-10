import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
    {
        // Tenant Information
        tenant: {
            tenantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tenant",
                required: true,
            },

            orgName: {
                type: String,
                required: true,
                trim: true,
            },

            email: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
            },
        },

        // Department Information
        name: {
            type: String,
            required: true,
            trim: true,
        },

        departmentCode: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        // Department Manager
        managedBy: {
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

        // Department Status
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

// Unique department name inside a tenant
departmentSchema.index(
    {
        "tenant.tenantId": 1,
        name: 1,
    },
    {
        unique: true,
    }
);

// Unique department code inside a tenant
departmentSchema.index(
    {
        "tenant.tenantId": 1,
        departmentCode: 1,
    },
    {
        unique: true,
    }
);

export default mongoose.model("Department", departmentSchema);