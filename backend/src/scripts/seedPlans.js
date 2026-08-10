import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/database.js";
import Plan from "../models/Plans.js";


const seedPlans = async () => {

    try {

        console.log("Starting Plan Seeding...");


        await connectDB();


        console.log("Database connected. Creating plans...");


        const plans = [

            {
                name: "Trial",
                description: "Free trial plan for new tenants",
                price: 0,
                employeeLimit: 10,
                duration: 30,
                durationType: "Days",
                isActive: true,
                isDeleted: false,
            },


            {
                name: "Basic",
                description: "Basic subscription plan",
                price: 999,
                employeeLimit: 50,
                duration: 1,
                durationType: "Months",
                isActive: true,
                isDeleted: false,
            },


            {
                name: "Premium",
                description: "Premium subscription plan",
                price: 2999,
                employeeLimit: 200,
                duration: 1,
                durationType: "Months",
                isActive: true,
                isDeleted: false,
            },


            {
                name: "Enterprise",
                description: "Enterprise subscription plan",
                price: 9999,
                employeeLimit: 1000,
                duration: 1,
                durationType: "Years",
                isActive: true,
                isDeleted: false,
            },

        ];



        for (const planData of plans) {


            const existingPlan = await Plan.findOne({
                name: planData.name,
            });



            if (existingPlan) {

                console.log(
                    `${planData.name} already exists`
                );

                continue;
            }



            const newPlan = await Plan.create(planData);


            console.log(
                `${newPlan.name} created successfully`
            );

        }



        console.log("Plan seeding completed successfully");


    } catch (error) {


        console.error(
            "Plan seeding failed:",
            error.message
        );


    } finally {


        await mongoose.connection.close();

        console.log("Database connection closed");

    }

};



seedPlans();