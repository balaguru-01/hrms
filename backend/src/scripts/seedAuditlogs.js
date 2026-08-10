import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/database.js";

import AuditLog from "../models/AuditLog.js";
import Tenant from "../models/Tenant.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Request from "../models/Request.js";

const seedAuditLogs = async () => {

    try {

        console.log("Starting Audit Log Seeding...");

        await connectDB();

        console.log("Database connected. Creating audit logs...");


        // Tenant

        const tenant = await Tenant.findOne({
            companyCode: "SEOSA",
        });

        if (!tenant) {
            throw new Error("Tenant not found.");
        }


        // Users

        const superAdmin = await User.findOne({
            email: "superadmin@tenanthub.com",
        });

        const enterpriseAdmin = await User.findOne({
            email: "enterpriseadmin@tenanthub.com",
        });

        const tenantAdmin = await User.findOne({
            email: "tenantadmin@seosaph.com",
        });

        const manager = await User.findOne({
            email: "manager@seosaph.com",
        });

        const employee = await User.findOne({
            email: "employee@seosaph.com",
        });

        const task = await Task.findOne({
            title: "Complete Employee Onboarding Module",
        });

        const request = await Request.findOne({
            requestType: "Leave",
        });

        if (
            !superAdmin ||
            !enterpriseAdmin ||
            !tenantAdmin ||
            !manager ||
            !employee
        ) {
            throw new Error("Required users not found.");
        }



        const logs = [

            {
                performedBy: superAdmin,
                module: "Authentication",
                action: "Login",
                description: "Super Admin logged into the system.",
                relatedTo: {
                    module: "User",
                    referenceId: superAdmin._id,
                    title: "Super Admin Login",
                },
            },

            {
                performedBy: enterpriseAdmin,
                module: "Tenant",
                action: "Approve",
                description: "Enterprise Admin approved Seosaph Technologies.",
                relatedTo: {
                    module: "Tenant",
                    referenceId: tenant._id,
                    title: tenant.orgName,
                },
            },

            {
                performedBy: tenantAdmin,
                module: "Department",
                action: "Create",
                description: "Tenant Admin created Information Technology department.",
                relatedTo: {
                    module: "Department",
                    referenceId: null,
                    title: "Information Technology",
                },
            },

            {
                performedBy: manager,
                module: "Task",
                action: "Assign",
                description: "Manager assigned onboarding task to employee.",
                relatedTo: {
                    module: "Task",
                    referenceId: task?._id || null,
                    title: task?.title || "",
                },
            },

            {
                performedBy: employee,
                module: "Request",
                action: "Submit",
                description: "Employee submitted leave request.",
                relatedTo: {
                    module: "Request",
                    referenceId: request?._id || null,
                    title: "Leave Request",
                },
            },

            {
                performedBy: employee,
                module: "Authentication",
                action: "Logout",
                description: "Employee logged out successfully.",
                relatedTo: {
                    module: "User",
                    referenceId: employee._id,
                    title: "Employee Logout",
                },
            },

        ];



        for (const log of logs) {

            const existingLog = await AuditLog.findOne({

                "performedBy.userId": log.performedBy._id,

                module: log.module,

                action: log.action,

                description: log.description,

            });


            if (existingLog) {

                console.log(
                    `${log.action} - ${log.module} already exists`
                );

                continue;

            }


            await AuditLog.create({

                tenant: {

                    tenantId: tenant._id,

                    orgName: tenant.orgName,

                    email: tenant.email,

                },


                performedBy: {

                    userId: log.performedBy._id,

                    name: `${log.performedBy.firstName} ${log.performedBy.lastName}`,

                    role: log.performedBy.role.name,

                    designation: log.performedBy.designation,

                },


                module: log.module,

                action: log.action,

                relatedTo: log.relatedTo,


                changes: {

                    oldData: null,

                    newData: null,

                },


                description: log.description,

                ipAddress: "127.0.0.1",

                userAgent: "Mozilla/5.0 (Seed Script)",

                status: "Success",

                isActive: true,

                isDeleted: false,

            });


            console.log(
                `${log.action} - ${log.module} created successfully`
            );

        }


        console.log(
            "Audit Log seeding completed successfully"
        );

    }
    catch (error) {

        console.error(
            "Audit Log seeding failed:",
            error.message
        );

    }
    finally {

        await mongoose.connection.close();

        console.log(
            "Database connection closed"
        );

    }

};

seedAuditLogs();