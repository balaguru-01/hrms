import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        // Tenant Information
        tenant: {
            tenantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tenant",
                default: null,
            },

            orgName: {
                type: String,
                default: null,
                trim: true,
            },

            email: {
                type: String,
                default: null,
                lowercase: true,
                trim: true,
            },
        },

        // User Who Performed the Action
        performedBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },

            name: {
                type: String,
                trim: true,
                default: null,
            },

            role: {
                type: String,
                default: null,
            },

            designation: {
                type: String,
                default: null,
                trim: true,
            },
        },

        // Module Name
        module: {
            type: String,
            required: true,
            trim: true,
        },

        // Action Performed
        action: {
            type: String,
            required: true,
            enum: [
                "Create",
                "Read",
                "Update",
                "Delete",
                "Login",
                "Logout",
                "Approve",
                "Reject",
                "Assign",
                "Submit",
                "Export",
                "Invite",
            ],
        },

        // Related Record Information
        relatedTo: {
            module: {
                type: String,
                default: null,
                trim: true,
            },

            referenceId: {
                type: mongoose.Schema.Types.ObjectId,
                default: null,
            },

            title: {
                type: String,
                default: "",
                trim: true,
            },
        },

        // Data Changes
        changes: {
            oldData: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },

            newData: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },
        },

        // Activity Description
        description: {
            type: String,
            required: true,
            trim: true,
        },

        // Request Information
        ipAddress: {
            type: String,
            default: "",
        },

        userAgent: {
            type: String,
            default: "",
        },

        // Operation Status
        status: {
            type: String,
            enum: ["Success", "Failed"],
            default: "Success",
        },

        // Account Status
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

// Tenant Activity Lookup
auditLogSchema.index({
    "tenant.tenantId": 1,
});

// User Activity History
auditLogSchema.index({
    "performedBy.userId": 1,
});

// Module Action Search
auditLogSchema.index({
    module: 1,
    action: 1,
});

export default mongoose.model("AuditLog", auditLogSchema);