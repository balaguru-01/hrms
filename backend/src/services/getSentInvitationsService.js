import User from "../models/User.js";
import constants from "../config/constants.js";

export const getSentInvitationsService = async ({
    userId,
    roleName,
    page = 1,
    limit = 10,
}) => {
   
    const currentScope =
        constants.roleScopes[roleName];

    if (!currentScope) {
        const error = new Error(
            "User role scope could not be determined"
        );

        error.statusCode = 403;
        error.auditReason =
            "Invalid or unsupported user role";

        throw error;
    }

    /*
     * Validate pagination values.
     */
    const currentPage = Number(page);
    const pageSize = Number(limit);

    if (
        !Number.isInteger(currentPage) ||
        currentPage < 1
    ) {
        const error = new Error(
            "Page must be a positive integer"
        );

        error.statusCode = 400;
        error.auditReason =
            "Invalid pagination page value";

        throw error;
    }

    if (
        !Number.isInteger(pageSize) ||
        pageSize < 1 ||
        pageSize > 100
    ) {
        const error = new Error(
            "Limit must be between 1 and 100"
        );

        error.statusCode = 400;
        error.auditReason =
            "Invalid pagination limit value";

        throw error;
    }

    /*
     * Tenant ID is required only if user belongs to tenant scope.
     */
    let tenantId = null;

    if (
        currentScope ===
        constants.scopes.tenant
    ) {
        /*
         * Fetch user's tenant information.
         */
        const currentUser =
            await User.findById(userId)
                .select("tenant")
                .lean();

        if (!currentUser) {
            const error = new Error("Logged-in user not found");
            error.statusCode = 404;
            error.auditReason = "Logged-in user could not be found";
            throw error;
        }

        tenantId =
            currentUser.tenant?.tenantId;

        if (!tenantId) {
            const error = new Error(
                "Tenant information could not be determined"
            );

            error.statusCode = 400;
            error.auditReason =
                "Tenant information is required for tenant-scope invitations";

            throw error;
        }
    }


    const targetRoles = Object.entries(
        constants.roleScopes
    )
        .filter(
            ([, scope]) =>
                scope === currentScope
        )
        .map(([role]) => role);

    /*
     * Fetch invited users belong to the same scope using roles.
     */
    const invitationQuery = {
        "role.name": {
            $in: targetRoles,
        },
        status: "Invited",
        isDeleted: false,
    };

    /*
     * Tenant-scope users can only see
     * invitations belonging to their own tenant.
     */
    
    if (
        currentScope ===
        constants.scopes.tenant
    ) {
        invitationQuery[
            "tenant.tenantId"
        ] = tenantId;
    }

    /*
     * Get total number of invitations
     * for server-side pagination.
     */
    const totalInvitations =
        await User.countDocuments(
            invitationQuery
        );

    const totalPages =
        Math.ceil(
            totalInvitations / pageSize
        );

    const skip =
        (currentPage - 1) * pageSize;

    /*
     * Fetch only the invitations required
     * for the current page.
     */
    const invitations = await User.find(
        invitationQuery
    )
        .select(
            "_id email role designation tenant status invitationTokenExpiresAt createdAt updatedAt createdBy"
        )
        .sort({
            createdAt: -1,
        })
        .skip(skip)
        .limit(pageSize)
        .lean();

    /*
     * Convert User documents into invitation
     * response objects.
     */
    const sentInvitations =
        invitations.map(
            (invitation) => {
                return {
                    invitationId:
                        invitation._id,

                    email:
                        invitation.email,

                    role:
                        invitation.role?.name ||
                        null,

                    roleId:
                        invitation.role?.roleId ||
                        null,

                    designation:
                        invitation.designation ||
                        null,

                    tenant:
                        invitation.tenant ||
                        null,

                    status:
                        invitation.status,

                    invitationSentAt:
                        invitation.createdAt,

                    invitationExpiresAt:
                        invitation.invitationTokenExpiresAt,

                    invitedBy:
                        invitation.createdBy ||
                        null,

                    updatedAt:
                        invitation.updatedAt,
                };
            }
        );

    return {
        invitations: sentInvitations,

        pagination: {
            currentPage,
            pageSize,
            totalInvitations,
            totalPages,
        },
    };
};