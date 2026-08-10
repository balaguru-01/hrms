import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
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

        // Task Information
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        // Task Creator
        assignedBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            name: {
                type: String,
                required: true,
                trim: true,
            },

            role: {
                type: String,
                required: true,
            },

            designation: {
                type: String,
                required: true,
                trim: true,
            },
        },

        // Task Receiver
        assignedTo: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            name: {
                type: String,
                required: true,
                trim: true,
            },

            role: {
                type: String,
                required: true,
            },

            designation: {
                type: String,
                required: true,
                trim: true,
            },
        },

        // Task Timeline
        timeline: {
            assignedAt: {
                type: Date,
                default: Date.now,
            },

            dueDate: {
                type: Date,
                required: true,
            },

            submittedAt: {
                type: Date,
                default: null,
            },

            completedAt: {
                type: Date,
                default: null,
            },
        },

        // Task Priority
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Urgent"],
            default: "Medium",
        },

        // Task Status
        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Completed",
                "Cancelled",
            ],
            default: "Pending",
        },

        // Completion Details
        completedBy: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },

            name: {
                type: String,
                default: null,
                trim: true,
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

        // Audit Information
        createdBy: {
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

// Tenant task lookup
taskSchema.index({
    "tenant.tenantId": 1,
});

// Employee dashboard optimization
taskSchema.index({
    "assignedTo.userId": 1,
    status: 1,
});

// Manager dashboard optimization
taskSchema.index({
    "assignedBy.userId": 1,
    status: 1,
});

export default mongoose.model("Task", taskSchema);