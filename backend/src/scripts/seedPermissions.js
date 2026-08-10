import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/database.js";

import Permission from "../models/Permission.js";
import Tenant from "../models/Tenant.js";
import Role from "../models/Role.js";
import User from "../models/User.js";


const seedPermissions = async () => {

    try {

        console.log("Starting Permission Seeding...");


        await connectDB();


        console.log("Database connected. Creating permissions...");



        // Get Tenant

        const tenant = await Tenant.findOne({
            companyCode:"SEOSA"
        });


        if(!tenant){

            throw new Error(
                "Tenant not found. Seed tenant first."
            );

        }



        // Get Super Admin User

        const superAdmin = await User.findOne({
            email:"superadmin@tenanthub.com"
        });


        if(!superAdmin){

            throw new Error(
                "SuperAdmin user not found. Seed users first."
            );

        }



        // Get Roles

        const roles = {};

        const roleNames = [
            "SuperAdmin",
            "EnterpriseAdmin",
            "TenantAdmin",
            "HR",
            "Manager",
            "Employee"
        ];



        for(const roleName of roleNames){

            const role = await Role.findOne({
                name:roleName
            });


            if(!role){

                throw new Error(
                    `${roleName} role not found`
                );

            }


            roles[roleName] = role;

        }




        const permissions = [


            // SuperAdmin

            {
                role:"SuperAdmin",
                resource:"system",
                actions:[
                    "create",
                    "read",
                    "update",
                    "delete",
                    "manage"
                ],

                description:
                "Complete system level access"
            },



            // Enterprise Admin

            {
                role:"EnterpriseAdmin",
                resource:"tenant",
                actions:[
                    "create",
                    "read",
                    "update",
                    "approve",
                    "reject"
                ],

                description:
                "Manage tenant onboarding and approvals"
            },



            // Tenant Admin

            {
                role:"TenantAdmin",
                resource:"user",
                actions:[
                    "create",
                    "read",
                    "update",
                    "delete",
                    "manage"
                ],

                description:
                "Manage tenant users"
            },


            {
                role:"TenantAdmin",
                resource:"department",
                actions:[
                    "create",
                    "read",
                    "update",
                    "delete"
                ],

                description:
                "Manage departments"
            },



            // HR

            {
                role:"HR",
                resource:"employee",
                actions:[
                    "create",
                    "read",
                    "update"
                ],

                description:
                "Manage employee information"
            },


            {
                role:"HR",
                resource:"attendance",
                actions:[
                    "read",
                    "update"
                ],

                description:
                "Manage employee attendance"
            },



            // Manager

            {
                role:"Manager",
                resource:"task",
                actions:[
                    "create",
                    "read",
                    "update"
                ],

                description:
                "Manage team tasks"
            },


            {
                role:"Manager",
                resource:"request",
                actions:[
                    "read",
                    "approve",
                    "reject"
                ],

                description:
                "Approve employee requests"
            },



            // Employee

            {
                role:"Employee",
                resource:"task",
                actions:[
                    "read",
                    "update"
                ],

                description:
                "View and update assigned tasks"
            },


            {
                role:"Employee",
                resource:"request",
                actions:[
                    "create",
                    "read"
                ],

                description:
                "Create and view requests"
            }


        ];





        for(const permissionData of permissions){



            const role = roles[permissionData.role];



            const existingPermission =
                await Permission.findOne({

                    tenant:{
                        tenantId:tenant._id
                    },

                    "role.roleId":role._id,

                    resource:
                    permissionData.resource

                });





            if(existingPermission){

                console.log(
                    `${permissionData.role} - ${permissionData.resource} already exists`
                );

                continue;

            }




            await Permission.create({

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:{

                    roleId:role._id,

                    name:role.name

                },


                resource:
                permissionData.resource,


                actions:
                permissionData.actions,


                description:
                permissionData.description,



                createdBy:{

                    userId:superAdmin._id,

                    name:
                    `${superAdmin.firstName} ${superAdmin.lastName}`,

                    role:
                    superAdmin.role.name

                },


                updatedBy:{

                    userId:null,

                    name:null,

                    role:null

                },


                isActive:true,

                isDeleted:false

            });



            console.log(
                `${permissionData.role} - ${permissionData.resource} created successfully`
            );


        }




        console.log(
            "Permission seeding completed successfully"
        );



    }
    catch(error){


        console.error(
            "Permission seeding failed:",
            error.message
        );


    }
    finally{


        await mongoose.connection.close();


        console.log(
            "Database connection closed"
        );

    }

};



seedPermissions();