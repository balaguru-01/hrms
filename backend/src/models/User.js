import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
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
                trim: true,
            },
        },

        // Basic User Information
        firstName: {
            type: String,
            trim: true,
        },

        lastName: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Invalid Email"],
        },

        password: {
            type: String,
            select: false,
        },

        phone: {
            type: String,
            trim: true,
        },

        // User Location
        location: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        // Profile Picture
        profilePicture: {
            type: String,
            trim: true,
            default: null,
        },

        // Authorization
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

        // Job Information
        designation: {
            type: String,
            trim: true,
            default: null,
        },

        department: {
            departmentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Department",
                default: null,
            },

            name: {
                type: String,
                trim: true,
                default: null,
            },
        },

        joiningDate: {
            type: Date,
            default: null,
        },

        employmentType: {
            type: String,
            enum: [
                "Full-Time",
                "Part-Time",
                "Intern",
                "Contract",
            ],
            default: null,
        },

        salary: {
            type: Number,
            default: null,
        },

        // Reporting Hierarchy
        reportingTo: {
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

        // Account Management
        status: {
            type: String,
            enum: [
                "Invited",
                "Active",
                "Inactive",
                "Pending",
                "Rejected",
                "Deleted",
                "Resigned",
                "Suspended",
            ],
            default: "Inactive",
        },

        isActive: {
            type: Boolean,
            default: false,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        // Invitation Tracking
        invitationToken: {
            type: String,
            default: null,
            select: false,
        },

        invitationTokenExpiresAt: {
            type: Date,
            default: null,
        },

        // Authentication Tracking
        lastLogin: {
            type: Date,
            default: null,
        },

        passwordChangedAt: {
            type: Date,
            default: null,
        },

        // Session Security
        tokenVersion: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

    // Unique email for every user
    userSchema.index(
        {
            email: 1,
        },
        {
            unique: true,
        }
    );

    // Unique phone only when a phone number exists
    userSchema.index(
        {
            phone: 1,
        },
        {
            unique: true,
            partialFilterExpression: {
                phone: {
                    $type: "string",
                },
            },
        }
    );

    // Helps the scheduled cleanup job find expired invitations
    userSchema.index({
        status: 1,
        invitationTokenExpiresAt: 1,
    });

export default mongoose.model("User", userSchema);