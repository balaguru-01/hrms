import sendUserInvitationService from "../services/invitationServices.js";
import userRegistrationService from "../services/userRegistrationService.js";

export const sendUserInvitation = async (req, res, next) => {
    try {
        const {
            email,
            roleId,
            orgName = null,
        } = req.body;

        const invitedBy = {
            userId: req.user.userId,
        };

        const result = await sendUserInvitationService({
            email,
            roleId,
            orgName,
            invitedBy,
        });

        res.status(200).json({
            success: true,
            message: "User invitation sent successfully",
            data: result,
        });
    } catch (error) {
        error.auditDetails = {
            module: "User",
            action: "Invite",
            reason: error.auditReason || error.message,
        };
        next(error);
    }
};


