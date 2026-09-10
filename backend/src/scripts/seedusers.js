import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";

import connectDB from "../config/database.js";

import User from "../models/User.js";
import Role from "../models/Role.js";
import Tenant from "../models/Tenant.js";


const seedUsers = async () => {

    try {

        console.log("Starting User Seeding...");


        await connectDB();


        console.log("Database connected. Creating users...");


        // Fetch Roles

        const superAdminRole = await Role.findOne({
            name: "SuperAdmin"
        });


        const enterpriseAdminRole = await Role.findOne({
            name: "EnterpriseAdmin"
        });


        const enterpriseUserRole = await Role.findOne({
            name: "EnterpriseUser"
        });


        const tenantSuperAdminRole = await Role.findOne({
            name: "TenantSuperAdmin"
        });


        const tenantAdminRole = await Role.findOne({
            name: "TenantAdmin"
        });


        const tenantUserRole = await Role.findOne({
            name: "TenantUser"
        });


        if (
            !superAdminRole ||
            !enterpriseAdminRole ||
            !enterpriseUserRole ||
            !tenantSuperAdminRole ||
            !tenantAdminRole ||
            !tenantUserRole
        ) {

            throw new Error(
                "Required roles not found. Seed roles first."
            );

        }


        // Fetch Tenant

        const tenant = await Tenant.findOne({
            companyCode: "SEOSA"
        });


        if (!tenant) {

            throw new Error(
                "Tenant not found. Seed tenant first."
            );

        }


        // Prepare Password

        const password =
            await bcrypt.hash(
                "Password@123",
                10
            );


        // Users

        const users = [

            // Super Admin

            {
                firstName: "System",
                lastName: "Admin",
                email: "superadmin@tenanthub.com",
                password,
                phone: "9000000001",

                role: {
                    roleId: superAdminRole._id,
                    name: superAdminRole.name
                },

                designation: "System Administrator",

                department: null,

                tenant: null,

                status: "Active",
                isActive: true,

                createdBy: {
                    userId: null,
                    name: "TenantHub System",
                    role: "SuperAdmin"
                }
            },


            // Enterprise Admin

            {
                firstName: "Enterprise",
                lastName: "Admin",
                email: "enterpriseadmin@tenanthub.com",
                password,
                phone: "9000000002",

                role: {
                    roleId: enterpriseAdminRole._id,
                    name: enterpriseAdminRole.name
                },

                designation: "Enterprise Administrator",

                department: null,

                tenant: null,

                status: "Active",
                isActive: true,

                createdBy: {
                    userId: null,
                    name: "TenantHub System",
                    role: "SuperAdmin"
                }
            },


            // Enterprise User

            {
                firstName: "Enterprise",
                lastName: "User",
                email: "enterpriseuser@tenanthub.com",
                password,
                phone: "9000000003",

                role: {
                    roleId: enterpriseUserRole._id,
                    name: enterpriseUserRole.name
                },

                designation: "Enterprise User",

                department: null,

                tenant: null,

                status: "Active",
                isActive: true,

                createdBy: {
                    userId: null,
                    name: "Enterprise Admin",
                    role: "EnterpriseAdmin"
                }
            },


            // Tenant Super Admin

            {
                firstName: "Tenant",
                lastName: "SuperAdmin",
                email: "tenantsuperadmin@seosaph.com",
                password,
                phone: "9000000004",

                tenant: {
                    tenantId: tenant._id,
                    orgName: tenant.orgName,
                    email: tenant.email
                },

                role: {
                    roleId: tenantSuperAdminRole._id,
                    name: tenantSuperAdminRole.name
                },

                designation: "Tenant Super Administrator",

                department: null,

                status: "Active",
                isActive: true,

                createdBy: {
                    userId: null,
                    name: "Enterprise Admin",
                    role: "EnterpriseAdmin"
                }
            },


            // Tenant Admin

            {
                firstName: "Tenant",
                lastName: "Admin",
                email: "tenantadmin@seosaph.com",
                password,
                phone: "9000000005",

                tenant: {
                    tenantId: tenant._id,
                    orgName: tenant.orgName,
                    email: tenant.email
                },

                role: {
                    roleId: tenantAdminRole._id,
                    name: tenantAdminRole.name
                },

                designation: "Tenant Administrator",

                department: null,

                status: "Active",
                isActive: true,

                createdBy: {
                    userId: null,
                    name: "Tenant Super Admin",
                    role: "TenantSuperAdmin"
                }
            },


            // Tenant User

            {
                firstName: "Tenant",
                lastName: "User",
                email: "tenantuser@seosaph.com",
                password,
                phone: "9000000006",

                tenant: {
                    tenantId: tenant._id,
                    orgName: tenant.orgName,
                    email: tenant.email
                },

                role: {
                    roleId: tenantUserRole._id,
                    name: tenantUserRole.name
                },

                designation: "Tenant User",

                department: null,

                status: "Active",
                isActive: true,

                createdBy: {
                    userId: null,
                    name: "Tenant Admin",
                    role: "TenantAdmin"
                }
            }

        ];


        // Create Users

        for (const userData of users) {

            const existingUser = await User.findOne({
                email: userData.email
            });


            console.log(
                userData.email,
                userData.role
            );


            if (existingUser) {

                console.log(
                    `${userData.email} already exists`
                );

                continue;

            }


            const user = await User.create(
                userData
            );


            console.log(
                `${user.email} created successfully`
            );

        }


        console.log(
            "User seeding completed successfully"
        );


    } catch (error) {

        console.error(
            "User seeding failed:",
            error.message
        );


    } finally {

        await mongoose.connection.close();


        console.log(
            "Database connection closed"
        );

    }

};


seedUsers();