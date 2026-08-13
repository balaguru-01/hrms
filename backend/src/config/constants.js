import dotenv from "dotenv";

dotenv.config();

const constants = {
    roles: {
        enterpriseAdmin: process.env.ENTERPRISE_ADMIN_ROLE,
        superAdmin: process.env.SUPER_ADMIN_ROLE,
        enterpriseUser: process.env.ENTERPRISE_USER_ROLE,

        tenantSuperAdmin: process.env.TENANT_SUPER_ADMIN_ROLE,
        tenantAdmin: process.env.TENANT_ADMIN_ROLE,
        tenantUser: process.env.TENANT_USER_ROLE
        
    },

    roleHierarchy: {
        [process.env.ENTERPRISE_ADMIN_ROLE]: [
            process.env.SUPER_ADMIN_ROLE,
            process.env.ENTERPRISE_USER_ROLE,
            process.env.TENANT_SUPER_ADMIN_ROLE,
            process.env.TENANT_ADMIN_ROLE,
            process.env.TENANT_USER_ROLE     
        ],

        [process.env.SUPER_ADMIN_ROLE]: [
            process.env.ENTERPRISE_USER_ROLE,
            process.env.TENANT_SUPER_ADMIN_ROLE,
            process.env.TENANT_ADMIN_ROLE,
            process.env.TENANT_USER_ROLE
        ],

        [process.env.ENTERPRISE_USER_ROLE] : [],

        [process.env.TENANT_SUPER_ADMIN_ROLE] : [
            process.env.TENANT_ADMIN_ROLE,
            process.env.TENANT_USER_ROLE
        ],

        [process.env.TENANT_ADMIN_ROLE]: [
            process.env.TENANT_USER_ROLE
        ],

        [process.env.TENANT_USER_ROLE]: []

    },
};

export default constants;