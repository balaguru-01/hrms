import User from "../models/User.js";

export const getSentInvitationsService = async ({
    invitedBy,
    page = 1,
    limit = 10,
}) => {
    // Validate logged-in user
    if (!invitedBy?.userId) {
        const error = new Error("Invalid request");
        error.statusCode = 400;
        error.auditReason =
            "Inviting user information was not found";
        throw error;
    }

    // Validate pagination values
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
     * Fetch users who are currently in Invited status
     */
    const invitationQuery = {
        "createdBy.userId": invitedBy.userId,
        status: "Invited",
        isDeleted: false,
    };

    /*
     * Get total number of invitations for server-side pagination.
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
     * Fetch only the invitations required for
     * the current page.
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
                const isExpired =
                    !invitation.invitationTokenExpiresAt ||
                    new Date(
                        invitation.invitationTokenExpiresAt
                    ) <= new Date();

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

                    isExpired,

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