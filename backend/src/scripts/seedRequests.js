import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/database.js";

import Request from "../models/Request.js";
import Tenant from "../models/Tenant.js";
import User from "../models/User.js";

const seedRequests = async () => {

    try {

        console.log("Starting Request Seeding...");

        await connectDB();

        console.log("Database connected. Creating requests...");


        // Tenant

        const tenant = await Tenant.findOne({
            companyCode: "SEOSA"
        });

        if (!tenant) {
            throw new Error("Tenant not found. Seed tenant first.");
        }


        // Users

        const employee = await User.findOne({
            email: "employee@seosaph.com"
        });

        const manager = await User.findOne({
            email: "manager@seosaph.com"
        });

        const hr = await User.findOne({
            email: "hr@seosaph.com"
        });

        if (!employee || !manager || !hr) {
            throw new Error("Required users not found. Seed users first.");
        }


        const requests = [

            {
                requestType: "Leave",

                leaveCategory: "Casual",

                reason: "Family function. Requesting two days of casual leave.",

                timeline: {
                    fromDate: new Date("2026-08-20"),
                    toDate: new Date("2026-08-21"),
                    requestedAt: new Date(),
                    completedAt: null
                },

                status: "Pending"
            }

        ];


        for (const requestData of requests) {

            const existingRequest = await Request.findOne({

                "tenant.tenantId": tenant._id,

                "requestedBy.userId": employee._id,

                requestType: requestData.requestType,

                "timeline.fromDate": requestData.timeline.fromDate

            });

            if (existingRequest) {

                console.log(
                    `${requestData.requestType} request already exists`
                );

                continue;
            }


            await Request.create({

                tenant: {

                    tenantId: tenant._id,

                    orgName: tenant.orgName,

                    email: tenant.email

                },


                requestedBy: {

                    userId: employee._id,

                    name: `${employee.firstName} ${employee.lastName}`,

                    role: employee.role.name,

                    designation: employee.designation

                },


                requestType: requestData.requestType,

                leaveCategory: requestData.leaveCategory,

                reason: requestData.reason,


                approvalFlow: [

                    {

                        level: 1,

                        approver: {

                            userId: manager._id,

                            name: `${manager.firstName} ${manager.lastName}`,

                            role: manager.role.name,

                            designation: manager.designation

                        },

                        status: "Pending",

                        processedAt: null,

                        comment: ""

                    },

                    {

                        level: 2,

                        approver: {

                            userId: hr._id,

                            name: `${hr.firstName} ${hr.lastName}`,

                            role: hr.role.name,

                            designation: hr.designation

                        },

                        status: "Waiting",

                        processedAt: null,

                        comment: ""

                    }

                ],


                timeline: requestData.timeline,


                processedBy: {

                    userId: null,

                    name: null,

                    role: null,

                    designation: null

                },


                createdBy: {

                    userId: employee._id,

                    name: `${employee.firstName} ${employee.lastName}`,

                    role: employee.role.name

                },


                updatedBy: {

                    userId: null,

                    name: null,

                    role: null

                },


                status: requestData.status,

                isActive: true,

                isDeleted: false

            });


            console.log(
                `${requestData.requestType} request created successfully`
            );

        }


        console.log("Request seeding completed successfully");

    }
    catch (error) {

        console.error(
            "Request seeding failed:",
            error.message
        );

    }
    finally {

        await mongoose.connection.close();

        console.log("Database connection closed");

    }

};

seedRequests();