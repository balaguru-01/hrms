import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/database.js";

import Tenant from "../models/Tenant.js";
import Department from "../models/Department.js";


const seedDepartments = async () => {

    try {

        console.log("Starting Department Seeding...");


        await connectDB();


        console.log("Database connected. Creating departments...");



        const tenant = await Tenant.findOne({
            companyCode: "SEOSA",
        });



        if (!tenant) {

            throw new Error(
                "Tenant not found. Please seed tenant first."
            );

        }



        const departments = [

            {
                name: "Human Resources",
                departmentCode: "HR",
                description: "Manages employee related activities",
            },


            {
                name: "Information Technology",
                departmentCode: "IT",
                description: "Manages technology and software operations",
            },


            {
                name: "Finance",
                departmentCode: "FIN",
                description: "Handles financial operations",
            },


            {
                name: "Operations",
                departmentCode: "OPS",
                description: "Handles business operations",
            },

        ];



        for (const departmentData of departments) {


            const existingDepartment = await Department.findOne({
                tenant: {
                    tenantId: tenant._id
                },

                departmentCode:
                    departmentData.departmentCode,
            });



            if (existingDepartment) {

                console.log(
                    `${departmentData.name} already exists`
                );

                continue;

            }



            const department = await Department.create({

                tenant: {

                    tenantId: tenant._id,

                    orgName: tenant.orgName,

                    email: tenant.email,

                },


                name: departmentData.name,


                departmentCode:
                    departmentData.departmentCode,


                description:
                    departmentData.description,



                managedBy: {

                    userId: null,

                    name: null,

                    role: null,

                },


                createdBy: {

                    userId: null,

                    name: "TenantHub System",

                    role: "SuperAdmin",

                },


                isActive: true,

                isDeleted: false,

            });



            console.log(
                `${department.name} created successfully`
            );

        }



        console.log(
            "Department seeding completed successfully"
        );


    } catch(error) {


        console.error(
            "Department seeding failed:",
            error.message
        );


    } finally {


        await mongoose.connection.close();


        console.log(
            "Database connection closed"
        );

    }

};



seedDepartments();