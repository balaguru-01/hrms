import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import connectDB from "../config/database.js";

import Task from "../models/Task.js";
import Tenant from "../models/Tenant.js";
import User from "../models/User.js";


const seedTasks = async () => {


    try {


        console.log("Starting Task Seeding...");


        await connectDB();


        console.log("Database connected. Creating tasks...");



        // Tenant

        const tenant = await Tenant.findOne({
            companyCode:"SEOSA"
        });



        if(!tenant){

            throw new Error(
                "Tenant not found. Seed tenant first."
            );

        }




        // Users


        const manager = await User.findOne({
            email:"manager@seosaph.com"
        });



        const employee = await User.findOne({
            email:"employee@seosaph.com"
        });



        const superAdmin = await User.findOne({
            email:"superadmin@tenanthub.com"
        });





        if(!manager || !employee || !superAdmin){

            throw new Error(
                "Required users not found. Seed users first."
            );

        }





        const tasks = [


            {
                title:
                "Complete Employee Onboarding Module",


                description:
                "Prepare onboarding workflow documentation and employee checklist.",


                assignedBy:{

                    userId:manager._id,

                    name:
                    `${manager.firstName} ${manager.lastName}`,

                    role:
                    manager.role.name,

                    designation:
                    manager.designation

                },



                assignedTo:{

                    userId:employee._id,

                    name:
                    `${employee.firstName} ${employee.lastName}`,

                    role:
                    employee.role.name,

                    designation:
                    employee.designation

                },



                timeline:{

                    assignedAt:new Date(),

                    dueDate:
                    new Date(
                        Date.now() + 7*24*60*60*1000
                    ),

                    submittedAt:null,

                    completedAt:null

                },


                priority:"High",

                status:"Pending",



                completedBy:{

                    userId:null,

                    name:null,

                    role:null,

                    designation:null

                },


                createdBy:{

                    userId:manager._id,

                    name:
                    `${manager.firstName} ${manager.lastName}`,

                    role:
                    manager.role.name

                },


                updatedBy:{

                    userId:null,

                    name:null,

                    role:null

                }

            },





            {

                title:
                "Prepare Monthly Attendance Report",


                description:
                "Review attendance records and submit monthly report.",



                assignedBy:{

                    userId:manager._id,

                    name:
                    `${manager.firstName} ${manager.lastName}`,

                    role:
                    manager.role.name,

                    designation:
                    manager.designation

                },



                assignedTo:{

                    userId:employee._id,

                    name:
                    `${employee.firstName} ${employee.lastName}`,

                    role:
                    employee.role.name,

                    designation:
                    employee.designation

                },



                timeline:{

                    assignedAt:new Date(),

                    dueDate:
                    new Date(
                        Date.now() + 14*24*60*60*1000
                    ),

                    submittedAt:null,

                    completedAt:null

                },



                priority:"Medium",

                status:"In Progress",



                completedBy:{

                    userId:null,

                    name:null,

                    role:null,

                    designation:null

                },



                createdBy:{

                    userId:manager._id,

                    name:
                    `${manager.firstName} ${manager.lastName}`,

                    role:
                    manager.role.name

                },



                updatedBy:{

                    userId:null,

                    name:null,

                    role:null

                }

            }


        ];







        for(const taskData of tasks){



            const existingTask =
            await Task.findOne({

                tenant:{
                    tenantId:tenant._id
                },

                title:taskData.title

            });





            if(existingTask){

                console.log(
                    `${taskData.title} already exists`
                );

                continue;

            }







            await Task.create({

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                ...taskData


            });




            console.log(
                `${taskData.title} created successfully`
            );


        }





        console.log(
            "Task seeding completed successfully"
        );



    }
    catch(error){


        console.error(
            "Task seeding failed:",
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



seedTasks();