import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/database.js";

import Role from "../models/Role.js";


const seedRoles = async () => {
    try {
        await connectDB();

        const systemRoles = [
            {
                name: "SuperAdmin",
                description:
                    "Controls the complete TenantHub platform",
                isSystemRole: true,
                isActive: true,
                isDeleted: false,
            },

            {
                name: "EnterpriseAdmin",
                description:
                    "Manages tenants and enterprise-level operations",
                isSystemRole: true,
                isActive: true,
                isDeleted: false,
            },

            {
                name: "TenantAdmin",
                description:
                    "Manages users and operations within a tenant",
                isSystemRole: true,
                isActive: true,
                isDeleted: false,
            },
            {
                name:"HR",
                description:"Managing the Human Resources",
                isSystemRole:true,
                isActive:true
            },


            {
                name:"Manager",
                description:"Managing things at department level",
                isSystemRole:true,
                isActive:true
            },


            {
                name:"Employee",
                description:"Basic employee of a company",
                isSystemRole:true,
                isActive:true
            }
                    ];


        for (const role of systemRoles) {

            const existingRole = await Role.findOne({
                name: role.name,
                isSystemRole: true,
            });


            if (existingRole) {
                console.log(
                    `${role.name} already exists`
                );
                continue;
            }


            await Role.create(role);

            console.log(
                `${role.name} created successfully`
            );
        }


        console.log("Role seeding completed");

        await mongoose.connection.close();

    } catch (error) {

        console.error(
            "Role seeding failed:",
            error.message
        );

        process.exit(1);
    }
};


seedRoles();