import dotenv from "dotenv";

dotenv.config();

const constants = {
    roles: {
        enterpriseAdmin: process.env.ENTERPRISE_ADMIN_ROLE,
        superAdmin: process.env.SUPER_ADMIN_ROLE,
        tenantAdmin: process.env.TENANT_ADMIN_ROLE,
        hr: process.env.HR_ROLE,
        manager: process.env.MANAGER_ROLE,
        employee: process.env.EMPLOYEE_ROLE,
    },

    roleHierarchy: {
        [process.env.ENTERPRISE_ADMIN_ROLE]: [
            process.env.SUPER_ADMIN_ROLE,
            process.env.TENANT_ADMIN_ROLE,
            process.env.HR_ROLE,
            process.env.MANAGER_ROLE,
            process.env.EMPLOYEE_ROLE,
        ],

        [process.env.SUPER_ADMIN_ROLE]: [
            process.env.TENANT_ADMIN_ROLE,
            process.env.HR_ROLE,
            process.env.MANAGER_ROLE,
            process.env.EMPLOYEE_ROLE,
        ],

        [process.env.TENANT_ADMIN_ROLE]: [
            process.env.HR_ROLE,
            process.env.MANAGER_ROLE,
            process.env.EMPLOYEE_ROLE,
        ],

        [process.env.HR_ROLE]: [
            process.env.MANAGER_ROLE,
            process.env.EMPLOYEE_ROLE,
        ],

        [process.env.MANAGER_ROLE]: [
            process.env.EMPLOYEE_ROLE,
        ],

        [process.env.EMPLOYEE_ROLE]: [],
    },
};

export default constants;