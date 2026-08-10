import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
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

        // Role Information
        role: {
            roleId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
                required: true,
            },

            name: {
                type: String,
                required: true,
                trim: true,
            },
        },

        // Resource
        resource: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        // Allowed Actions
        actions: [
            {
                type: String,
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
        ],

        description: {
            type: String,
            default: "",
            trim: true,
        },

        // Audit Information
        createdBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
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

        // Permission Status
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

// One permission document per Role + Resource inside a Tenant
permissionSchema.index(
    {
        "tenant.tenantId": 1,
        "role.roleId": 1,
        resource: 1,
    },
    {
        unique: true,
    }
);

export default mongoose.model("Permission", permissionSchema);