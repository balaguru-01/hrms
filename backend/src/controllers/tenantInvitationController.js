import tenantInvitationService from "../services/tenantInvitationService.js";

export const sendTenantInvitation = async (req, res, next) => {
    try {
        const {
            organizationName,
            email,
        } = req.body;

        const invitedBy = {
            userId: req.user.userId,
            name: req.user.name || "",
            role: req.user.role || "",
            designation: req.user.designation || null,
        };

        const result = await tenantInvitationService({
            organizationName,
            email,
            invitedBy,
        });

        return res.status(200).json({
            success: true,
            message: "Tenant invitation sent successfully.",
            data: result,
        });
    } catch (error) {
        error.auditDetails = {
            module: "Tenant",
            action: "Invite",
            reason:
                error.auditReason ||
                error.message,
        };

        next(error);
    }
};