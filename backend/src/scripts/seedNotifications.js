import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/database.js";

import Notification from "../models/Notification.js";
import Tenant from "../models/Tenant.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Request from "../models/Request.js";

const seedNotifications = async () => {

    try {

        console.log("Starting Notification Seeding...");

        await connectDB();

        console.log("Database connected. Creating notifications...");


        // Tenant

        const tenant = await Tenant.findOne({
            companyCode: "SEOSA",
        });

        if (!tenant) {
            throw new Error("Tenant not found.");
        }


        // Users

        const manager = await User.findOne({
            email: "manager@seosaph.com",
        });

        const employee = await User.findOne({
            email: "employee@seosaph.com",
        });

        const hr = await User.findOne({
            email: "hr@seosaph.com",
        });

        if (!manager || !employee || !hr) {
            throw new Error("Required users not found.");
        }


        // Related Records

        const task = await Task.findOne({
            title: "Complete Employee Onboarding Module",
        });

        const request = await Request.findOne({
            requestType: "Leave",
        });

        if (!task || !request) {
            throw new Error("Task or Request not found.");
        }


        const notifications = [

            {

                title: "New Task Assigned",

                message:
                    "A new onboarding task has been assigned to you.",

                notificationType: "Task",

                sender: manager,

                recipient: employee,

                relatedTo: {

                    module: "Task",

                    referenceId: task._id,

                    title: task.title,

                },

            },



            {

                title: "Leave Request Submitted",

                message:
                    "A leave request has been submitted for your approval.",

                notificationType: "Request",

                sender: employee,

                recipient: manager,

                relatedTo: {

                    module: "Request",

                    referenceId: request._id,

                    title: "Leave Request",

                },

            },



            {

                title: "Attendance Updated",

                message:
                    "Today's attendance has been marked successfully.",

                notificationType: "Attendance",

                sender: hr,

                recipient: employee,

                relatedTo: {

                    module: "Attendance",

                    referenceId: employee._id,

                    title: "Attendance",

                },

            },



            {

                title: "Welcome to HRMS",

                message:
                    "Welcome to the HRMS Portal. Have a productive day!",

                notificationType: "Announcement",

                sender: hr,

                recipient: employee,

                relatedTo: {

                    module: "System",

                    referenceId: tenant._id,

                    title: "Welcome",

                },

            },

        ];



        for (const notification of notifications) {

            const existingNotification =
                await Notification.findOne({

                    "recipient.userId":
                        notification.recipient._id,

                    title: notification.title,

                });


            if (existingNotification) {

                console.log(
                    `${notification.title} already exists`
                );

                continue;

            }


            await Notification.create({

                tenant: {

                    tenantId: tenant._id,

                    orgName: tenant.orgName,

                    email: tenant.email,

                },


                sender: {

                    userId: notification.sender._id,

                    name: `${notification.sender.firstName} ${notification.sender.lastName}`,

                    role: notification.sender.role.name,

                    designation:
                        notification.sender.designation,

                },


                recipient: {

                    userId: notification.recipient._id,

                    name: `${notification.recipient.firstName} ${notification.recipient.lastName}`,

                    role: notification.recipient.role.name,

                    designation:
                        notification.recipient.designation,

                },


                title: notification.title,

                message: notification.message,

                notificationType:
                    notification.notificationType,

                relatedTo: notification.relatedTo,

                isRead: false,

                timeline: {

                    sentAt: new Date(),

                    readAt: null,

                },

                isActive: true,

                isDeleted: false,

            });


            console.log(
                `${notification.title} created successfully`
            );

        }


        console.log(
            "Notification seeding completed successfully"
        );

    }
    catch (error) {

        console.error(
            "Notification seeding failed:",
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

seedNotifications();