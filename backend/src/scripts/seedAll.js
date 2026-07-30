require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/database");


// ===============================
// MODELS
// ===============================

const Tenant = require("../models/Tenant");
const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const Department = require("../models/Department");
const Task = require("../models/Task");
const Request = require("../models/Request");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");



// ===============================
// SEED FUNCTION
// ===============================

const seedDatabase = async () => {

    try {


        // ===============================
        // DATABASE CONNECTION
        // ===============================

        await connectDB();

        console.log("Database Connected");



        /*
        =================================
        CLEAR OLD DATA
        =================================
        */

        await Promise.all([

            Tenant.deleteMany(),

            User.deleteMany(),

            Role.deleteMany(),

            Permission.deleteMany(),

            Department.deleteMany(),

            Task.deleteMany(),

            Request.deleteMany(),

            Attendance.deleteMany(),

            Notification.deleteMany(),

            AuditLog.deleteMany()

        ]);


        console.log("Old Data Removed");



        /*
        =================================
        TENANT CREATION
        =================================
        */


        const tenant = await Tenant.create({

            orgName:"Seosaph Technologies",


            companyCode:"SEOSA",


            email:"admin@seosaph.com",


            phone:"9876543210",


            website:"https://seosaph.com",


            industry:"IT",



            address:{

                doorNumber:"101",

                street:"Tech Park Road",

                city:"Coimbatore",

                state:"Tamil Nadu",

                country:"India",

                postalCode:"641001"

            },



            subscription:{


                plan:"Premium",


                status:"Active",


                startDate:new Date(),


                endDate:new Date(

                    new Date().setFullYear(

                        new Date().getFullYear()+1

                    )

                )


            },



            employeeLimit:100,



            createdBy:{


                userId:null,


                name:"System",


                role:"System"


            }


        });



        console.log("Tenant Created");





        /*
        =================================
        PASSWORD HASH
        =================================
        */


        const password = await bcrypt.hash(

            "Password@123",

            10

        );



        console.log("Password Generated");


               

              /*
        =================================
        DEPARTMENTS
        =================================
        */


        const hrDepartment = await Department.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            name:"Human Resources",


            departmentCode:"HR",


            description:"Human Resource Department",



            managedBy:{

                userId:null,

                name:null,

                role:null

            },


            createdBy:{

                userId:null,

                name:"System",

                role:"System"

            },


            isActive:true,

            isDeleted:false


        });



        const itDepartment = await Department.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            name:"Information Technology",


            departmentCode:"IT",


            description:"IT Department",



            managedBy:{

                userId:null,

                name:null,

                role:null

            },


            createdBy:{

                userId:null,

                name:"System",

                role:"System"

            },


            isActive:true,

            isDeleted:false


        });



        const financeDepartment = await Department.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            name:"Finance",


            departmentCode:"FIN",


            description:"Finance Department",



            managedBy:{

                userId:null,

                name:null,

                role:null

            },


            createdBy:{

                userId:null,

                name:"System",

                role:"System"

            },


            isActive:true,

            isDeleted:false


        });



        console.log("Departments Created");





        /*
        =================================
        ROLES
        =================================
        */



        const enterpriseAdminRole = await Role.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            name:"enterpriseAdmin",


            description:"System Super Administrator",



            createdBy:{

                userId:null,

                name:"System",

                role:"System"

            },


            isSystemRole:true,


            isActive:true,

            isDeleted:false


        });





        const tenantAdminRole = await Role.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            name:"TenantAdmin",


            description:"Tenant Administrator",



            createdBy:{

                userId:null,

                name:"System",

                role:"System"

            },


            isSystemRole:true,


            isActive:true,

            isDeleted:false


        });





        const hrRole = await Role.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            name:"HR",


            description:"Human Resource",



            createdBy:{

                userId:null,

                name:"System",

                role:"System"

            },


            isSystemRole:true,


            isActive:true,

            isDeleted:false


        });






        const managerRole = await Role.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            name:"Manager",


            description:"Department Manager",



            createdBy:{

                userId:null,

                name:"System",

                role:"System"

            },


            isSystemRole:true,


            isActive:true,

            isDeleted:false


        });






        const employeeRole = await Role.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            name:"Employee",


            description:"Employee",



            createdBy:{

                userId:null,

                name:"System",

                role:"System"

            },


            isSystemRole:true,


            isActive:true,

            isDeleted:false


        });



        console.log("Roles Created");


               /*
        =================================
        USERS
        =================================
        */


        // ===============================
        // SUPER ADMIN
        // ===============================


        const enterpriseAdmin = await User.create({


            // tenant:{                    //enterpriseAdmin Don't need Tenant

            //     tenantId:tenant._id,

            //     orgName:tenant.orgName,

            //     email:tenant.email

            // },


            firstName:"Super",

            lastName:"Admin",


            email:"enterpriseAdmin@seosaph.com",


            password:password,


            phone:"9876543201",



            role:enterpriseAdminRole._id,



            designation:"Super Administrator",



            department:itDepartment._id,



            joiningDate:new Date(),



            employmentType:"Full-Time",



            salary:150000,



            reportingTo:{

                userId:null,

                name:null,

                role:null

            },



            createdBy:{

                userId:null,

                name:"System",

                role:"System"

            },


            status:"Active",

            isActive:true,

            isDeleted:false


        });





        // ===============================
        // TENANT ADMIN
        // ===============================


        const tenantAdmin = await User.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            firstName:"Tenant",

            lastName:"Admin",


            email:"tenantadmin@seosaph.com",


            password:password,


            phone:"9876543202",



            role:tenantAdminRole._id,



            designation:"Tenant Administrator",



            department:itDepartment._id,



            joiningDate:new Date(),



            employmentType:"Full-Time",



            salary:100000,



            reportingTo:{

                userId:enterpriseAdmin._id,

                name:"Super Admin",

                role:"enterpriseAdmin"

            },



            createdBy:{

                userId:enterpriseAdmin._id,

                name:"Super Admin",

                role:"enterpriseAdmin"

            },


            status:"Active",

            isActive:true,

            isDeleted:false


        });





        // ===============================
        // HR USER
        // ===============================


        const hr = await User.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            firstName:"Priya",

            lastName:"Sharma",


            email:"hr@seosaph.com",


            password:password,


            phone:"9876543203",



            role:hrRole._id,



            designation:"HR Executive",



            department:hrDepartment._id,



            joiningDate:new Date(),



            employmentType:"Full-Time",



            salary:60000,



            reportingTo:{

                userId:tenantAdmin._id,

                name:"Tenant Admin",

                role:"TenantAdmin"

            },



            createdBy:{

                userId:tenantAdmin._id,

                name:"Tenant Admin",

                role:"TenantAdmin"

            },


            status:"Active",

            isActive:true,

            isDeleted:false


        });





        // ===============================
        // MANAGER
        // ===============================


        const manager = await User.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            firstName:"Arun",

            lastName:"Kumar",


            email:"manager@seosaph.com",


            password:password,


            phone:"9876543204",



            role:managerRole._id,



            designation:"Project Manager",



            department:itDepartment._id,



            joiningDate:new Date(),



            employmentType:"Full-Time",



            salary:80000,



            reportingTo:{

                userId:tenantAdmin._id,

                name:"Tenant Admin",

                role:"TenantAdmin"

            },



            createdBy:{

                userId:tenantAdmin._id,

                name:"Tenant Admin",

                role:"TenantAdmin"

            },


            status:"Active",

            isActive:true,

            isDeleted:false


        });





        // ===============================
        // EMPLOYEE
        // ===============================


        const employee = await User.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },


            firstName:"Rahul",

            lastName:"Kumar",


            email:"employee@seosaph.com",


            password:password,


            phone:"9876543205",



            role:employeeRole._id,



            designation:"Software Engineer",



            department:itDepartment._id,



            joiningDate:new Date(),



            employmentType:"Full-Time",



            salary:40000,



            reportingTo:{

                userId:manager._id,

                name:"Arun Kumar",

                role:"Manager"

            },



            createdBy:{

                userId:manager._id,

                name:"Arun Kumar",

                role:"Manager"

            },


            status:"Active",

            isActive:true,

            isDeleted:false


        });



        console.log("Users Created");





        /*
        =================================
        UPDATE DEPARTMENT MANAGERS
        =================================
        */


        hrDepartment.managedBy = {


            userId:hr._id,


            name:"Priya Sharma",


            role:"HR"


        };


        await hrDepartment.save();





        itDepartment.managedBy = {


            userId:manager._id,


            name:"Arun Kumar",


            role:"Manager"


        };


        await itDepartment.save();



        console.log("Department Managers Updated");


               /*
        =================================
        PERMISSIONS
        =================================
        */


        // ===============================
        // SUPER ADMIN PERMISSIONS
        // ===============================


        await Permission.insertMany([


            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:enterpriseAdminRole._id,


                module:"users",


                actions:[

                    "create",
                    "read",
                    "update",
                    "delete",
                    "approve",
                    "reject",
                    "export",
                    "manage"

                ],


                description:"Full access to Users",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:enterpriseAdminRole._id,


                module:"departments",


                actions:[

                    "create",
                    "read",
                    "update",
                    "delete",
                    "manage"

                ],


                description:"Full access to Departments",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:enterpriseAdminRole._id,


                module:"roles",


                actions:[

                    "create",
                    "read",
                    "update",
                    "delete",
                    "manage"

                ],


                description:"Full access to Roles",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:enterpriseAdminRole._id,


                module:"permissions",


                actions:[

                    "create",
                    "read",
                    "update",
                    "delete",
                    "manage"

                ],


                description:"Full access to Permissions",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:enterpriseAdminRole._id,


                module:"attendance",


                actions:[

                    "create",
                    "read",
                    "update",
                    "delete",
                    "approve",
                    "export"

                ],


                description:"Full access to Attendance",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:enterpriseAdminRole._id,


                module:"requests",


                actions:[

                    "create",
                    "read",
                    "update",
                    "delete",
                    "approve",
                    "reject",
                    "manage"

                ],


                description:"Full access to Requests",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:enterpriseAdminRole._id,


                module:"tasks",


                actions:[

                    "create",
                    "read",
                    "update",
                    "delete",
                    "manage"

                ],


                description:"Full access to Tasks",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            }


        ]);



        console.log("enterpriseAdmin Permissions Created");







        // ===============================
        // TENANT ADMIN PERMISSIONS
        // ===============================


        await Permission.insertMany([


            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:tenantAdminRole._id,


                module:"users",


                actions:[

                    "create",
                    "read",
                    "update",
                    "delete"

                ],


                description:"Manage Users",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:tenantAdminRole._id,


                module:"departments",


                actions:[

                    "create",
                    "read",
                    "update",
                    "delete"

                ],


                description:"Manage Departments",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:tenantAdminRole._id,


                module:"roles",


                actions:[

                    "create",
                    "read",
                    "update"

                ],


                description:"Manage Roles",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:tenantAdminRole._id,


                module:"attendance",


                actions:[

                    "read",
                    "update",
                    "approve",
                    "export"

                ],


                description:"Manage Attendance",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:tenantAdminRole._id,


                module:"requests",


                actions:[

                    "read",
                    "approve",
                    "reject",
                    "manage"

                ],


                description:"Manage Requests",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:tenantAdminRole._id,


                module:"tasks",


                actions:[

                    "create",
                    "read",
                    "update",
                    "delete"

                ],


                description:"Manage Tasks",



                createdBy:{

                    userId:enterpriseAdmin._id,

                    name:"Super Admin",

                    role:"enterpriseAdmin"

                }

            }


        ]);



        console.log("TenantAdmin Permissions Created");
                
       
        // ===============================
        // HR PERMISSIONS
        // ===============================


        await Permission.insertMany([


            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:hrRole._id,


                module:"users",


                actions:[

                    "create",
                    "read",
                    "update"

                ],


                description:"Manage Employees",



                createdBy:{

                    userId:tenantAdmin._id,

                    name:"Tenant Admin",

                    role:"TenantAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:hrRole._id,


                module:"departments",


                actions:[

                    "read",
                    "update"

                ],


                description:"View and Update Departments",



                createdBy:{

                    userId:tenantAdmin._id,

                    name:"Tenant Admin",

                    role:"TenantAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:hrRole._id,


                module:"attendance",


                actions:[

                    "read",
                    "update",
                    "approve"

                ],


                description:"Manage Attendance",



                createdBy:{

                    userId:tenantAdmin._id,

                    name:"Tenant Admin",

                    role:"TenantAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:hrRole._id,


                module:"requests",


                actions:[

                    "read",
                    "approve",
                    "reject"

                ],


                description:"Approve Leave and Other Requests",



                createdBy:{

                    userId:tenantAdmin._id,

                    name:"Tenant Admin",

                    role:"TenantAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:hrRole._id,


                module:"tasks",


                actions:[

                    "read"

                ],


                description:"View Assigned Tasks",



                createdBy:{

                    userId:tenantAdmin._id,

                    name:"Tenant Admin",

                    role:"TenantAdmin"

                }

            }


        ]);



        console.log("HR Permissions Created");







        // ===============================
        // MANAGER PERMISSIONS
        // ===============================


        await Permission.insertMany([



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:managerRole._id,


                module:"tasks",


                actions:[

                    "create",
                    "read",
                    "update"

                ],


                description:"Manage Team Tasks",



                createdBy:{

                    userId:tenantAdmin._id,

                    name:"Tenant Admin",

                    role:"TenantAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:managerRole._id,


                module:"requests",


                actions:[

                    "read",
                    "approve",
                    "reject"

                ],


                description:"Approve Team Requests",



                createdBy:{

                    userId:tenantAdmin._id,

                    name:"Tenant Admin",

                    role:"TenantAdmin"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:managerRole._id,


                module:"attendance",


                actions:[

                    "read"

                ],


                description:"View Team Attendance",



                createdBy:{

                    userId:tenantAdmin._id,

                    name:"Tenant Admin",

                    role:"TenantAdmin"

                }

            }



        ]);



        console.log("Manager Permissions Created");







        // ===============================
        // EMPLOYEE PERMISSIONS
        // ===============================


        await Permission.insertMany([



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:employeeRole._id,


                module:"tasks",


                actions:[

                    "read",
                    "update"

                ],


                description:"View and Update Own Tasks",



                createdBy:{

                    userId:manager._id,

                    name:"Arun Kumar",

                    role:"Manager"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:employeeRole._id,


                module:"requests",


                actions:[

                    "create",
                    "read"

                ],


                description:"Create and View Own Requests",



                createdBy:{

                    userId:manager._id,

                    name:"Arun Kumar",

                    role:"Manager"

                }

            },



            {

                tenant:{

                    tenantId:tenant._id,

                    orgName:tenant.orgName,

                    email:tenant.email

                },


                role:employeeRole._id,


                module:"attendance",


                actions:[

                    "create",
                    "read"

                ],


                description:"Mark and View Own Attendance",



                createdBy:{

                    userId:manager._id,

                    name:"Arun Kumar",

                    role:"Manager"

                }

            }



        ]);



        console.log("Employee Permissions Created");
        console.log("Permissions Created");


        /*
        =================================
        TASK
        =================================
        */


        const task = await Task.create({

            tenant:{
                tenantId:tenant._id,
                orgName:tenant.orgName,
                email:tenant.email
            },


            title:"Develop Employee Dashboard",


            description:
            "Create employee dashboard module for HRMS system",



            assignedBy:{

                userId:manager._id,

                name:"Arun Kumar",

                role:"Manager"

            },



            assignedTo:{

                userId:employee._id,

                name:"Rahul Kumar",

                role:"Employee"

            },



            timeline:{


                assignedAt:new Date(),


                dueDate:new Date(
                    new Date().setDate(
                        new Date().getDate()+7
                    )
                ),


                submittedAt:null,


                completedAt:null

            },



            priority:"High",


            status:"In Progress",



            completedBy:{

                userId:null,

                name:null,

                role:null

            },


            isActive:true,

            isDeleted:false


        });


        console.log("Task Created");
        
        /*
        =================================
        REQUEST
        =================================
        */


        const request = await Request.create({

            tenant:{
                tenantId:tenant._id,
                orgName:tenant.orgName,
                email:tenant.email
            },


            requestedBy:{

                userId:employee._id,

                name:"Rahul Kumar",

                role:"Employee"

            },


            requestType:"Leave",


            leaveCategory:"Casual",


            reason:"Family function",



            approvalFlow:[

                {

                    level:1,

                    approver:{

                        userId:manager._id,

                        name:"Arun Kumar",

                        role:"Manager"

                    },

                    status:"Pending",

                    actionAt:null,

                    comment:""

                }

            ],



            timeline:{


                fromDate:new Date(
                    new Date().setDate(
                        new Date().getDate()+5
                    )
                ),


                toDate:new Date(
                    new Date().setDate(
                        new Date().getDate()+6
                    )
                ),


                requestedAt:new Date(),


                completedAt:null


            },


            processedBy:{


                userId:null,

                name:null,

                role:null

            },



            status:"Pending",


            isActive:true,

            isDeleted:false


        });


        console.log("Request Created");

        /*
        =================================
        ATTENDANCE
        =================================
        */

        const attendance = await Attendance.create({

            tenant:{
                tenantId:tenant._id,
                orgName:tenant.orgName,
                email:tenant.email
            },


            user:{

                userId:employee._id,

                name:"Rahul Kumar",

                department:"Information Technology"

            },


            date:new Date(),


            currentSession:"Logged Out",



            checkIn:{

                time:new Date(
                    new Date().setHours(9,0,0,0)
                ),

                location:"Office"

            },



            breaks:[

                {

                    breakType:"Lunch Break",

                    startTime:new Date(
                        new Date().setHours(13,0,0,0)
                    ),


                    endTime:new Date(
                        new Date().setHours(14,0,0,0)
                    ),


                    duration:1

                }

            ],




            checkOut:{

                time:new Date(
                    new Date().setHours(18,0,0,0)
                ),


                location:"Office"

            },




            totalLoginHours:9,


            totalBreakHours:1,


            totalWorkingHours:8,



            status:"Present",




            createdBy:{


                userId:employee._id,


                name:"Rahul Kumar",


                role:"Employee"


            },
            isActive:true,
            isDeleted:false


        });


        console.log("Attendance Created");





        /*
        =================================
        NOTIFICATION
        =================================
        */


        const notification = await Notification.create({


            tenant:{

                tenantId:tenant._id,

                orgName:tenant.orgName,

                email:tenant.email

            },



            sender:{


                userId:manager._id,


                name:"Arun Kumar",


                role:"Manager"


            },




            recipient:{


                userId:employee._id,


                name:"Rahul Kumar",


                role:"Employee"


            },




            title:"New Task Assigned",




            message:
            "A new development task has been assigned to you.",




            type:"Task",




            reference:{


                module:"Task",


                referenceId:task._id


            },





            isRead:false,





            timeline:{


                sentAt:new Date(),


                readAt:null


            },isActive:true,
              isDeleted:false



        });



        console.log("Notification Created");







        /*
        =================================
        AUDIT LOG
        =================================
        */



        const auditLog = await AuditLog.create({



            tenant:{


                tenantId:tenant._id,


                orgName:tenant.orgName,


                email:tenant.email


            },





            performedBy:{


                userId:manager._id,


                name:"Arun Kumar",


                role:"Manager"


            },





            module:"Task",





            action:"Create",



            reference:{
                module:"Task",
                referenceId:task._id


            },

            description:
            "Manager assigned a new task to the employee.",
            ipAddress:"127.0.0.1",
            device:"Seed Script"




        });



        console.log("Audit Log Created");







        console.log("\n======================================");

        console.log("HRMS Database Seeded Successfully");

        console.log("======================================\n");






        await mongoose.connection.close();



        console.log("Database Connection Closed");



    }

    catch(error){


        console.error("Seeding Failed");


        console.error(error);



        await mongoose.connection.close();



    }



};




seedDatabase();