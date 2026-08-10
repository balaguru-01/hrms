import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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

        // Employee Information
        employee: {
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

            department: {
                departmentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Department",
                    default: null,
                },

                name: {
                    type: String,
                    default: null,
                    trim: true,
                },
            },
        },

        // Attendance Date
        attendanceDate: {
            type: Date,
            required: true,
        },

        // Attendance Source
        attendanceSource: {
            type: String,
            enum: ["Web", "Mobile", "Admin", "Biometric"],
            default: "Web",
        },

        // Current Session
        currentSession: {
            type: String,
            enum: [
                "Logged Out",
                "Logged In",
                "On Break",
            ],
            default: "Logged Out",
        },

        // Check In Details
        checkIn: {
            time: {
                type: Date,
                default: null,
            },

            location: {
                type: String,
                default: "",
                trim: true,
            },
        },

        // Break Tracking
        breaks: [
            {
                breakType: {
                    type: String,
                    enum: [
                        "Tea Break",
                        "Lunch Break",
                        "Personal Break",
                        "Other",
                    ],
                    default: "Other",
                },

                startTime: {
                    type: Date,
                    default: null,
                },

                endTime: {
                    type: Date,
                    default: null,
                },

                duration: {
                    type: Number,
                    default: 0,
                },
            },
        ],

        // Check Out Details
        checkOut: {
            time: {
                type: Date,
                default: null,
            },

            location: {
                type: String,
                default: "",
                trim: true,
            },
        },

        // Working Hours Calculation
        totalLoginHours: {
            type: Number,
            default: 0,
        },

        totalBreakHours: {
            type: Number,
            default: 0,
        },

        totalWorkingHours: {
            type: Number,
            default: 0,
        },

        // Attendance Status
        status: {
            type: String,
            enum: [
                "Present",
                "Absent",
                "Leave",
                "Half-Day",
                "Holiday",
            ],
            default: "Present",
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

// One attendance record per employee per day within a tenant
attendanceSchema.index(
    {
        "tenant.tenantId": 1,
        "employee.userId": 1,
        attendanceDate: 1,
    },
    {
        unique: true,
    }
);

// Employee attendance history
attendanceSchema.index({
    "employee.userId": 1,
    attendanceDate: -1,
});

export default mongoose.model("Attendance", attendanceSchema);