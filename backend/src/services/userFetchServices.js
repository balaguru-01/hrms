import User from "../models/User.js";
import Role from "../models/Role.js";
import constants from "../config/constants.js";

const fetchUsers = async ({
    roleName,
    scope,
    status,
    page = 1,
    limit = 10,
}) => {
    try {
        const {
            roles,
            scopes,
            roleScopes,
        } = constants;

        // Validate pagination values
        const currentPage = Number(page);
        const pageSize = Number(limit);

        if (
            !Number.isInteger(currentPage) ||
            currentPage < 1
        ) {
            const error = new Error("Invalid data");
            error.statusCode = 400;
            error.auditReason =
                "Page must be a positive integer";
            throw error;
        }

        if (
            !Number.isInteger(pageSize) ||
            pageSize < 1 ||
            pageSize > 100
        ) {
            const error = new Error("Invalid data");
            error.statusCode = 400;
            error.auditReason =
                "Limit must be between 1 and 100";
            throw error;
        }

        // Validate logged-in user's role
        const roleExists =
            Object.values(roles).includes(
                roleName
            );

        if (!roleExists) {
            const error = new Error("Invalid data");
            error.statusCode = 400;
            error.auditReason =
                "Role does not exist";
            throw error;
        }

        // Validate requested scope
        const scopeExists =
            Object.values(scopes).includes(
                scope
            );

        if (!scopeExists) {
            const error = new Error("Invalid data");
            error.statusCode = 400;
            error.auditReason =
                "Invalid scope";
            throw error;
        }

        // Check whether the logged-in user's role
        // belongs to the requested scope
        if (roleScopes[roleName] !== scope) {
            const error = new Error(
                "Unauthorized Access"
            );

            error.statusCode = 403;

            error.auditReason =
                "User role does not have access to the requested scope";

            throw error;
        }

        // Get roles that belong to the requested scope
        const scopeRoles =
            Object.entries(roleScopes)
                .filter(
                    ([, roleScope]) =>
                        roleScope === scope
                )
                .map(([role]) => role);

        if (scopeRoles.length === 0) {
            return {
                users: [],
                pagination: {
                    currentPage,
                    pageSize,
                    totalUsers: 0,
                    totalPages: 0,
                },
            };
        }

        // Fetch active roles from Role collection
        const roleDetails = await Role.find({
            name: {
                $in: scopeRoles,
            },
            isActive: true,
            isDeleted: false,
        })
            .select("_id name")
            .lean();

        const roleIds = roleDetails.map(
            (role) => role._id
        );

        // Build user query
        const userQuery = {
            isDeleted: false,
            "role.roleId": {
                $in: roleIds,
            },
        };

        // All Users should include only
        // Active, Pending and Rejected users.
        if (status) {
            userQuery.status = status;
        } else {
            userQuery.status = {
                $in: [
                    "Active",
                    "Pending",
                    "Rejected",
                ],
            };
        }

        // Calculate how many documents to skip
        const skip =
            (currentPage - 1) * pageSize;

        // Get total number of matching users
        const totalUsers =
            await User.countDocuments(
                userQuery
            );

        // Fetch only the users required
        // for the current page
        const users = await User.find(
            userQuery
        )
            .select(
                "_id firstName lastName email role designation phone location status joiningDate createdAt updatedAt"
            )
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(pageSize)
            .lean();

        // Calculate total number of pages
        const totalPages =
            Math.ceil(
                totalUsers / pageSize
            );

        return {
            users,

            pagination: {
                currentPage,
                pageSize,
                totalUsers,
                totalPages,
            },
        };
    } catch (error) {
        throw error;
    }
};

export default fetchUsers;