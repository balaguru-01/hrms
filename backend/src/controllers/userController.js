import sendUserInvitationService from "../services/invitationServices.js";
import userRegistrationService from "../services/userRegistrationService.js";
import fetchRoles from "../services/roleFetchServices.js";

export const sendUserInvitation = async (req, res, next) => {
    try {
        const {
            email,
            roleId,
            orgName = null,
            invitedDesignation
        } = req.body;

        const invitedBy = {
            userId: req.user.userId,
        };

        const result = await sendUserInvitationService({
            email,
            roleId,
            orgName,
            invitedBy,
            invitedDesignation
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


export const registerUser = async (req, res, next) => {
    try {

        const {
            token,
            firstName,
            lastName,
            email,
            password,
            phone,
            location
        } = req.body;


        const user = await userRegistrationService({
            token,
            firstName,
            lastName,
            email,
            password,
            phone,
            location
        });


        return res.status(201).json({
            success: true,
            message:
                `Dear ${user.firstName} ${user.lastName}, your registration submitted successfully. Your account is pending for approval.`,

        });

    }
    catch (error) {
         error.auditDetails = {
            module: "User",
            action: "Create",
            reason: error.auditReason || error.message,
        };
        next(error);
    }
};


export const fetchingRoles = async (req, res, next) => {
    try {

        // Logged-in user's role comes from auth middleware
        const roleName = req.user.role;

        // recieving scope comes from query parameter
        const { scope } = req.query;

        const roleDetails = await fetchRoles(
            roleName,
            scope
        );

        return res.status(200).json({
            success: true,
            message: "Roles fetched successfully",
            data: roleDetails
        });

    } catch (error) {

        error.auditDetails = {
            module: "User",
            action: "Fetch",
            reason: error.auditReason || error.message,
        };

        next(error);
    }
};
