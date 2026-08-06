const bcrypt = require("bcrypt");
const User = require("../models/User");
const Role = require("../models/Role");

const seedUsers = async () => {

    console.log("Seeding Enterprise Admin...");

    const existingAdmin = await User.findOne({
        email: process.env.ENTERPRISE_ADMIN_EMAIL,
        isDeleted: false
    });

    if (existingAdmin) {

        console.log("• Enterprise Admin already exists");

        return;
    }

    const enterpriseAdminRole = await Role.findOne({
        name: "EnterpriseAdmin",
        isSystemRole: true,
        isDeleted: false
    });

    if (!enterpriseAdminRole) {

        throw new Error(
            "EnterpriseAdmin role not found. Run seedRoles first."
        );
    }

    const hashedPassword = await bcrypt.hash(
        process.env.ENTERPRISE_ADMIN_PASSWORD,
        10
    );

    await User.create({

        tenant: {
            tenantId: null,
            orgName: null,
            email: null
        },

        firstName: "Enterprise",

        lastName: "Admin",

        email: process.env.ENTERPRISE_ADMIN_EMAIL,

        password: hashedPassword,

        phone: "9999999999",

        role: enterpriseAdminRole._id,

        designation: "Enterprise Administrator",

        department: null,

        joiningDate: new Date(),

        employmentType: "Full-Time",

        salary: 0,

        reportingTo: {
            userId: null,
            name: null,
            role: null
        },

        createdBy: {
            userId: null,
            name: "System",
            role: "System"
        },

        status: "Active",

        isActive: true,

        isDeleted: false,

        lastLogin: null,

        passwordChangedAt: null,

        tokenVersion: 0

    });

    console.log("✓ Enterprise Admin created");

    console.log("Users Seeding Completed");
};

module.exports = {
    seedUsers
};