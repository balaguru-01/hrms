const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        enum: ["Trial", "Basic", "Premium", "Enterprise"]
    },

    description: {
        type: String,
        default: ""
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    employeeLimit: {
        type: Number,
        required: true,
        min: 1
    },

    duration: {
        type: Number,
        required: true,
        min: 1
    },

    durationType: {
        type: String,
        required: true,
        enum: ["Days", "Months", "Years"]
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Plan", planSchema);