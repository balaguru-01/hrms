require("dotenv").config();

const connectDB = require("../config/database");

const Tenant = require("../models/Tenant");
const Permission = require("../models/Permission");
const Role = require("../models/Role");
const User = require("../models/User");
const Department = require("../models/Department");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const LeaveRequest = require("../models/LeaveRequest");
const Task = require("../models/Task");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

const bcrypt = require("bcryptjs");

const seedDatabase = async () => {
  try {

    await connectDB();

    console.log("Connected to MongoDB");

    await Attendance.deleteMany({});
    await LeaveRequest.deleteMany({});
    await Task.deleteMany({});
    await Notification.deleteMany({});
    await AuditLog.deleteMany({});
    await Employee.deleteMany({});
    await Department.deleteMany({});
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await Tenant.deleteMany({});

    console.log("Old Data Deleted");

    const tenant = await Tenant.create({
      companyName: "ABC Technologies",
      companyCode: "ABC001",
      email: "admin@abctech.com",
      phone: "9876543210",
      website: "https://abctech.com",
      industry: "Software",
      address: {
        street: "Anna Nagar",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        postalCode: "600001",
      },
      subscription: {
        plan: "Enterprise",
        status: "Active",
      },
      employeeLimit: 500,
    });

    console.log("Tenant Created");

    const permissions = await Permission.insertMany([
      {
        module: "employee",
        action: "create",
        permissionName: "employee.create",
        description: "Create Employee",
      },
      {
        module: "employee",
        action: "read",
        permissionName: "employee.read",
        description: "View Employee",
      },
      {
        module: "employee",
        action: "update",
        permissionName: "employee.update",
        description: "Update Employee",
      },
      {
        module: "employee",
        action: "delete",
        permissionName: "employee.delete",
        description: "Delete Employee",
      },
      {
        module: "department",
        action: "manage",
        permissionName: "department.manage",
        description: "Manage Departments",
      },
      {
        module: "attendance",
        action: "manage",
        permissionName: "attendance.manage",
        description: "Manage Attendance",
      },
      {
        module: "leave",
        action: "approve",
        permissionName: "leave.approve",
        description: "Approve Leave",
      },
      {
        module: "task",
        action: "manage",
        permissionName: "task.manage",
        description: "Manage Tasks",
      },
      {
        module: "report",
        action: "export",
        permissionName: "report.export",
        description: "Export Reports",
      },
    ]);

    console.log("Permissions Created");

    const superAdminRole = await Role.create({
      roleName: "Super Admin",
      description: "Complete System Access",
      permissions: permissions.map((p) => p._id),
      isSystemRole: true,
    });

    const hrRole = await Role.create({
      roleName: "HR Manager",
      description: "HR Operations",
      permissions: [
        permissions[0]._id,
        permissions[1]._id,
        permissions[2]._id,
        permissions[4]._id,
        permissions[5]._id,
        permissions[6]._id,
      ],
      isSystemRole: true,
    });

    const employeeRole = await Role.create({
      roleName: "Employee",
      description: "Employee Access",
      permissions: [
        permissions[1]._id,
      ],
      isSystemRole: true,
    });

    console.log("Roles Created");

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const adminUser = await User.create({
      tenant: tenant._id,
      role: superAdminRole._id,
      firstName: "System",
      lastName: "Administrator",
      email: "admin@abctech.com",
      password: hashedPassword,
      phone: "9876543210",
    });

    console.log("Admin User Created");

    const itDepartment = await Department.create({
      tenant: tenant._id,
      departmentName: "Information Technology",
      departmentCode: "IT001",
      description: "Handles software development and IT operations",
      isActive: true,
    });

    const hrDepartment = await Department.create({
      tenant: tenant._id,
      departmentName: "Human Resources",
      departmentCode: "HR001",
      description: "Handles employee management",
      isActive: true,
    });

    const financeDepartment = await Department.create({
      tenant: tenant._id,
      departmentName: "Finance",
      departmentCode: "FIN001",
      description: "Handles accounts and finance",
      isActive: true,
    });

    console.log("Departments Created");

    const adminEmployee = await Employee.create({
      tenant: tenant._id,
      department: itDepartment._id,
      user: adminUser._id,
      employeeId: "EMP001",
      designation: "System Administrator",
      joiningDate: new Date("2024-01-01"),
      salary: 100000,
      employmentType: "Full-Time",
      status: "Active",
    });

    itDepartment.manager = adminEmployee._id;
    await itDepartment.save();

    console.log("Employees Created");

    await Attendance.create({
      tenant: tenant._id,
      employee: adminEmployee._id,
      date: new Date(),
      checkIn: new Date(),
      checkOut: new Date(),
      status: "Present",
      workingHours: 8,
    });

    console.log("Attendance Created");

    await LeaveRequest.create({
      tenant: tenant._id,
      employee: adminEmployee._id,
      leaveType: "Casual",
      fromDate: new Date("2026-07-28"),
      toDate: new Date("2026-07-29"),
      reason: "Family Function",
      status: "Pending",
    });

    console.log("Leave Request Created");

    await Task.create({
      tenant: tenant._id,
      assignedTo: adminEmployee._id,
      assignedBy: adminUser._id,
      title: "Complete HRMS Backend",
      description: "Develop Authentication Module",
      priority: "High",
      status: "In Progress",
      dueDate: new Date("2026-08-05"),
    });

    console.log("Task Created");

    await Notification.create({
      tenant: tenant._id,
      receiver: adminUser._id,
      title: "Welcome",
      message: "Welcome to HRMS",
      type: "System",
      isRead: false,
    });

    console.log("Notification Created");

    await AuditLog.create({
      tenant: tenant._id,
      user: adminUser._id,
      action: "CREATE",
      module: "System",
      description: "Initial database seeded successfully",
      ipAddress: "127.0.0.1",
      device: "Seed Script",
    });

    console.log("Audit Log Created");
    console.log("HRMS DATABASE SEEDED SUCCESSFULLY");


    process.exit(0);

  } catch (error) {

    console.error("\nSeed Error");
    console.error(error);

    process.exit(1);

  }

};

seedDatabase();