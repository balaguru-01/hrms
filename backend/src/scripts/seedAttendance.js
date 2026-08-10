import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/database.js";

import Attendance from "../models/Attendance.js";
import Tenant from "../models/Tenant.js";
import User from "../models/User.js";
import Department from "../models/Department.js";

const seedAttendance = async () => {

    try {

        console.log("Starting Attendance Seeding...");

        await connectDB();

        console.log("Database connected. Creating attendance...");



        // Tenant

        const tenant = await Tenant.findOne({
            companyCode: "SEOSA",
        });

        if (!tenant) {
            throw new Error("Tenant not found.");
        }



        // Employee

        const employee = await User.findOne({
            email: "employee@seosaph.com",
        });

        if (!employee) {
            throw new Error("Employee not found.");
        }



        // Department

        const department = await Department.findOne({
            name: "Information Technology",
        });



        // Manager (Creator)

        const manager = await User.findOne({
            email: "manager@seosaph.com",
        });

        if (!manager) {
            throw new Error("Manager not found.");
        }



        const attendanceRecords = [

            {
                attendanceDate: new Date("2026-08-01"),

                attendanceSource: "Web",

                currentSession: "Logged Out",

                checkIn: {
                    time: new Date("2026-08-01T09:00:00"),
                    location: "Bangalore Office",
                },

                breaks: [
                    {
                        breakType: "Lunch Break",
                        startTime: new Date("2026-08-01T13:00:00"),
                        endTime: new Date("2026-08-01T14:00:00"),
                        duration: 1,
                    },
                ],

                checkOut: {
                    time: new Date("2026-08-01T18:00:00"),
                    location: "Bangalore Office",
                },

                totalLoginHours: 9,

                totalBreakHours: 1,

                totalWorkingHours: 8,

                status: "Present",
            },



            {
                attendanceDate: new Date("2026-08-02"),

                attendanceSource: "Web",

                currentSession: "Logged Out",

                checkIn: {
                    time: new Date("2026-08-02T09:00:00"),
                    location: "Bangalore Office",
                },

                breaks: [],

                checkOut: {
                    time: new Date("2026-08-02T13:00:00"),
                    location: "Bangalore Office",
                },

                totalLoginHours: 4,

                totalBreakHours: 0,

                totalWorkingHours: 4,

                status: "Half-Day",
            },



            {
                attendanceDate: new Date("2026-08-03"),

                attendanceSource: "Admin",

                currentSession: "Logged Out",

                checkIn: {
                    time: null,
                    location: "",
                },

                breaks: [],

                checkOut: {
                    time: null,
                    location: "",
                },

                totalLoginHours: 0,

                totalBreakHours: 0,

                totalWorkingHours: 0,

                status: "Leave",
            },

        ];



        for (const attendance of attendanceRecords) {

            const existingAttendance = await Attendance.findOne({

                "tenant.tenantId": tenant._id,

                "employee.userId": employee._id,

                attendanceDate: attendance.attendanceDate,

            });

            if (existingAttendance) {

                console.log(
                    `${attendance.attendanceDate.toDateString()} already exists`
                );

                continue;
            }



            await Attendance.create({

                tenant: {

                    tenantId: tenant._id,

                    orgName: tenant.orgName,

                    email: tenant.email,

                },



                employee: {

                    userId: employee._id,

                    name: `${employee.firstName} ${employee.lastName}`,

                    role: employee.role.name,

                    designation: employee.designation,

                    department: {

                        departmentId: department?._id || null,

                        name: department?.name || null,

                    },

                },



                attendanceDate: attendance.attendanceDate,

                attendanceSource: attendance.attendanceSource,

                currentSession: attendance.currentSession,

                checkIn: attendance.checkIn,

                breaks: attendance.breaks,

                checkOut: attendance.checkOut,

                totalLoginHours: attendance.totalLoginHours,

                totalBreakHours: attendance.totalBreakHours,

                totalWorkingHours: attendance.totalWorkingHours,

                status: attendance.status,



                createdBy: {

                    userId: manager._id,

                    name: `${manager.firstName} ${manager.lastName}`,

                    role: manager.role.name,

                },



                updatedBy: {

                    userId: null,

                    name: null,

                    role: null,

                },



                isActive: true,

                isDeleted: false,

            });

            console.log(
                `${attendance.attendanceDate.toDateString()} created successfully`
            );

        }



        console.log(
            "Attendance seeding completed successfully"
        );

    }
    catch (error) {

        console.error(
            "Attendance seeding failed:",
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

seedAttendance();