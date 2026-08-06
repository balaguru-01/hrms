const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("../config/database");
const Plan = require("../models/Plans");

dotenv.config();

const seedPlans = async () => {
    try {

        await connectDB();

        // Remove existing plans
        await Plan.deleteMany();

        // Insert plans
        await Plan.insertMany([
            {
                name: "Trial",
                description: "Free trial plan for new organizations.",
                price: 0,
                employeeLimit: 10,
                duration: 14,
                durationType: "Days",
                isActive: true,
                isDeleted: false
            },
            {
                name: "Basic",
                description: "Basic plan for small organizations.",
                price: 999,
                employeeLimit: 50,
                duration: 1,
                durationType: "Months",
                isActive: true,
                isDeleted: false
            },
            {
                name: "Premium",
                description: "Premium plan for growing organizations.",
                price: 2999,
                employeeLimit: 250,
                duration: 6,
                durationType: "Months",
                isActive: true,
                isDeleted: false
            },
            {
                name: "Enterprise",
                description: "Enterprise plan for large organizations.",
                price: 9999,
                employeeLimit: 1000,
                duration: 12,
                durationType: "Months",
                isActive: true,
                isDeleted: false
            }
        ]);

        console.log("Plans seeded successfully.");
        process.exit(0);

    } catch (error) {

        console.error("Error seeding plans:", error);
        process.exit(1);

    } finally {

        await mongoose.connection.close();

    }
};

seedPlans();