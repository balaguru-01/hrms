import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";

import connectDB from "../config/database.js";

import User from "../models/User.js";
import Role from "../models/Role.js";
import Tenant from "../models/Tenant.js";
import Department from "../models/Department.js";


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


        const tenantAdminRole = await Role.findOne({
            name: "TenantAdmin"
        });
        const hrRole = await Role.findOne({
            name: "HR"
        });
         const managerRole = await Role.findOne({
            name: "Manager"
        });
         const employeeRole = await Role.findOne({
            name: "Employee"
        });

        



        if(
            !superAdminRole ||
            !enterpriseAdminRole ||
            !tenantAdminRole
        ){

            throw new Error(
                "Required roles not found. Seed roles first."
            );

        }



        // Fetch Tenant

        const tenant = await Tenant.findOne({
            companyCode: "SEOSA"
        });



        if(!tenant){

            throw new Error(
                "Tenant not found. Seed tenant first."
            );

        }



        // Fetch Departments

        const hrDepartment = await Department.findOne({
            departmentCode:"HR"
        });


        const itDepartment = await Department.findOne({
            departmentCode:"IT"
        });


        const operationsDepartment = await Department.findOne({
            departmentCode:"OPS"
        });



        const password =
            await bcrypt.hash(
                "Password@123",
                10
            );



        const users = [

            // Super Admin

            {
                firstName:"System",
                lastName:"Admin",
                email:"superadmin@tenanthub.com",
                password,
                phone:"9000000001",

                role:{
                    roleId: superAdminRole._id,
                    name: superAdminRole.name
                },

                designation:"System Administrator",

                department:null,

                tenant:null,


                status:"Active",
                isActive:true,


                createdBy:{
                    userId:null,
                    name:"TenantHub System",
                    role:"SuperAdmin"
                }
            },



            // Enterprise Admin

            {
                firstName:"Enterprise",
                lastName:"Admin",
                email:"enterpriseadmin@tenanthub.com",
                password,
                phone:"9000000002",

                role:{
                    roleId: enterpriseAdminRole._id,
                    name: enterpriseAdminRole.name
                },

                designation:"Enterprise Administrator",

                department:null,

                tenant:null,


                status:"Active",
                isActive:true,


                createdBy:{
                    userId:null,
                    name:"TenantHub System",
                    role:"SuperAdmin"
                }
            },



            // Tenant Admin

            {
                firstName:"Tenant",
                lastName:"Admin",
                email:"tenantadmin@seosaph.com",
                password,
                phone:"9000000003",

                tenant:{
                    tenantId:tenant._id,
                    orgName:tenant.orgName,
                    email:tenant.email
                },


            
                role:{
                    roleId: tenantAdminRole._id,
                    name: tenantAdminRole.name
                },


                designation:"Tenant Administrator",

                department:null,


                status:"Active",
                isActive:true,


                createdBy:{
                    userId:null,
                    name:"Enterprise Admin",
                    role:"EnterpriseAdmin"
                }
            },


            // HR User

            {
                firstName:"HR",
                lastName:"Manager",
                email:"hr@seosaph.com",
                password,
                phone:"9000000004",

                tenant:{
                    tenantId:tenant._id,
                    orgName:tenant.orgName,
                    email:tenant.email
                },


                role:{
                    roleId:hrRole._id,
                    name:hrRole.name
                },


                designation:"HR Manager",

                department:{
                    departmentId:hrDepartment._id,
                    name:hrDepartment.name
                },


                status:"Active",
                isActive:true,


                createdBy:{
                    userId:null,
                    name:"Tenant Admin",
                    role:"TenantAdmin"
                }
            },



            // Manager User

            {
                firstName:"Operations",
                lastName:"Manager",
                email:"manager@seosaph.com",
                password,
                phone:"9000000005",

                tenant:{
                    tenantId:tenant._id,
                    orgName:tenant.orgName,
                    email:tenant.email
                },


                 role:{
                    roleId:managerRole._id,
                    name:managerRole.name
                },


                designation:"Operations Manager",


                department:{
                    departmentId:operationsDepartment._id,
                    name:operationsDepartment.name
                },


                status:"Active",
                isActive:true,


                createdBy:{
                    userId:null,
                    name:"Tenant Admin",
                    role:"TenantAdmin"
                }
            },



            // Employee User

            {
                firstName:"John",
                lastName:"Employee",
                email:"employee@seosaph.com",
                password,
                phone:"9000000006",

                tenant:{
                    tenantId:tenant._id,
                    orgName:tenant.orgName,
                    email:tenant.email
                },


                role:{
                    roleId:employeeRole._id,
                    name:employeeRole.name
                },


                designation:"Software Engineer",


                department:{
                    departmentId:itDepartment._id,
                    name:itDepartment.name
                },


                status:"Active",
                isActive:true,


                createdBy:{
                    userId:null,
                    name:"Manager",
                    role:"Manager"
                }
            }

        ];



        for(const userData of users){


            const existingUser = await User.findOne({
                email:userData.email
            });

            console.log(userData.email, userData.role);



            if(existingUser){

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


    }catch(error){


        console.error(
            "User seeding failed:",
            error.message
        );


    }finally{


        await mongoose.connection.close();


        console.log(
            "Database connection closed"
        );

    }

};



seedUsers();