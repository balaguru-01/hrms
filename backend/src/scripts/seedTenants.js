import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/database.js";

import Tenant from "../models/Tenant.js";
import Plan from "../models/Plans.js";


const seedTenants = async () => {

    try {

        console.log("Starting Tenant Seeding...");


        await connectDB();


        console.log("Database connected. Creating tenant...");


        // Fetch Trial Plan
        const trialPlan = await Plan.findOne({
            name: "Trial",
        });


        if (!trialPlan) {

            throw new Error(
                "Trial plan not found. Please seed plans first."
            );

        }



        const tenantData = {

            orgName: "Seosaph Technologies",

            companyCode: "SEOSA",

            email: "admin@seosaph.com",

            phone: "9876543210",

            website: "https://seosaph.com",

            logo: "",

            industry: "IT",


            address: {

                doorNumber: "101",

                street: "Main Road",

                city: "Bengaluru",

                state: "Karnataka",

                country: "India",

                postalCode: "560001",

            },


            subscription: {

                plan: {

                    planId: trialPlan._id,

                    name: trialPlan.name,

                },


                employeeLimit: trialPlan.employeeLimit,


                status: "Active",


                rejectedReason: null,


                subscriptionStartDate: new Date(),


                subscriptionEndDate: new Date(
                    new Date().setDate(
                        new Date().getDate() + trialPlan.duration
                    )
                ),

            },


            createdBy: {

                userId: null,

                name: "TenantHub System",

                role: "SuperAdmin",

            },


            isActive: true,

            isDeleted: false,

        };



        const existingTenant = await Tenant.findOne({
            companyCode: tenantData.companyCode,
        });



        if (existingTenant) {

            console.log(
                "Tenant already exists"
            );

        } 
        else {

            const tenant = await Tenant.create(
                tenantData
            );


            console.log(
                `${tenant.orgName} created successfully`
            );

        }



        console.log(
            "Tenant seeding completed successfully"
        );


    } catch(error) {


        console.error(
            "Tenant seeding failed:",
            error.message
        );


    } finally {


        await mongoose.connection.close();

        console.log(
            "Database connection closed"
        );

    }

};


seedTenants();