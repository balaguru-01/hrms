import constants from "../config/constants.js";
import Role from "../models/Role.js";

const fetchRoles = async (roleName, scope) => {

    const {
        roles,
        scopes,
        roleScopes,
        roleHierarchy
    } = constants;

    // 1. Validate logged-in user's role

    const roleExists = Object.values(roles).includes(roleName);

    if (!roleExists) {
        const error = new Error("Invalid data");

        error.statusCode = 400;
        error.auditReason = "Role does not exist";

        throw error;
    }


    // 2. Validate requested scope

    const scopeExists = Object.values(scopes).includes(scope);

    if (!scopeExists) {
        const error = new Error("Invalid data");
        error.statusCode = 400;
        error.auditReason = "Invalid scope";
        throw error;
    }


    // 3. Get roles this user is allowed to create

    const allowedRoles = roleHierarchy[roleName] || [];

    if (allowedRoles.length === 0) {
        return [];
    }


    // 4. Filter allowed roles based on requested scope

    const scopeBasedRoles = allowedRoles.filter(
        role => roleScopes[role] === scope
    );

    if (scopeBasedRoles.length === 0) {
        return [];
    }


    // 5. Fetch role details from database

    const roleDetails = await Role.find({
        name: {
            $in: scopeBasedRoles
        },
        isActive: true,
        isDeleted: false
    })
        .select("_id name")
        .lean();

    return roleDetails;
};

export default fetchRoles;