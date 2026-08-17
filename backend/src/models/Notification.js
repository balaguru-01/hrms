import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        // Tenant Information
        tenant: {
            tenantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tenant",
            },

            orgName: {
                type: String,
                trim: true,
            },

            email: {
                type: String,
                lowercase: true,
                trim:true,
            },
        },

        // Notification Sender
        sender: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },

            name: {
                type: String,
                required: true,
            },

            role: {
                type: String,
            },

            designation: {
                type: String,
                trim: true,
            },
        },

        // Notification Recipient
        recipient: {
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
                trim: true,
                default : null
            },
        },

        // Notification Content
        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        notificationType: {
            type: String,
            required: true,
            enum: [
                "Task",
                "Request",
                "Attendance",
                "Department",
                "User",
                "Role",
                "System",
                "Announcement",
            ],
        },

        // Related Record Information
        relatedTo: {
            module: {
                type: String,
                required: true,
                trim: true,
            },

            referenceId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },

            title: {
                type: String,
                default: "",
                trim: true,
            },
        },

        // Read Status
        isRead: {
            type: Boolean,
            default: false,
        },

        // Notification Timeline
        timeline: {
            sentAt: {
                type: Date,
                default: Date.now,
            },

            readAt: {
                type: Date,
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

// Tenant Notifications
notificationSchema.index({
    "tenant.tenantId": 1,
});

// User Inbox Optimization
notificationSchema.index({
    "recipient.userId": 1,
    isRead: 1,
});

// Recent Notifications
notificationSchema.index({
    createdAt: -1,
});

export default mongoose.model("Notification", notificationSchema);