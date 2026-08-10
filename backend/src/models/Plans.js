import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
    {
        // Plan Information
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            enum: ["Trial", "Basic", "Premium", "Enterprise"],
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        employeeLimit: {
            type: Number,
            required: true,
            min: 1,
        },

        duration: {
            type: Number,
            required: true,
            min: 1,
        },

        durationType: {
            type: String,
            required: true,
            enum: ["Days", "Months", "Years"],
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

        // Plan Status
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

export default mongoose.model("Plan", planSchema);