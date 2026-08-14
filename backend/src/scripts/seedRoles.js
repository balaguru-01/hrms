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
                name: "EnterpriseUser",
                description:
                    "Performs enterprise-level operations within the TenantHub platform",
                isSystemRole: true,
                isActive: true,
                isDeleted: false,
            },

            {
                name: "TenantSuperAdmin",
                description:
                    "Manages tenant-level administration and operations",
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
                name: "TenantUser",
                description:
                    "Performs regular operations within a tenant",
                isSystemRole: true,
                isActive: true,
                isDeleted: false,
            },
        ];

        for (const role of systemRoles) {
            const existingRole = await Role.findOne({
                name: role.name,
                isSystemRole: true,
            });

            if (existingRole) {
                console.log(`${role.name} already exists`);
                continue;
            }

            await Role.create(role);

            console.log(`${role.name} created successfully`);
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