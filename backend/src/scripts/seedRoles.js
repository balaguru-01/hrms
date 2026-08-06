const Role = require("../models/Role");

const seedRoles = async () => {

    console.log("Seeding System Roles...");

    const systemRoles = [
        {
            name: "EnterpriseAdmin",
            description: "Enterprise Administrator"
        },
        {
            name: "TenantAdmin",
            description: "Tenant Administrator"
        },
        {
            name: "HR",
            description: "Human Resources"
        },
        {
            name: "Manager",
            description: "Manager"
        },
        {
            name: "Employee",
            description: "Employee"
        }
    ];

    for (const role of systemRoles) {

        const existingRole = await Role.findOne({
            name: role.name,
            isSystemRole: true,
            isDeleted: false
        });

        if (existingRole) {

            console.log(`• ${role.name} already exists`);

            continue;
        }

        await Role.create({

            name: role.name,

            description: role.description,

            createdBy: {
                userId: null,
                name: "System",
                role: "System"
            },

            isSystemRole: true,

            isActive: true,

            isDeleted: false

        });

        console.log(`✓ ${role.name} created`);
    }

    console.log("System Roles Seeding Completed");
};

module.exports = {
    seedRoles
};