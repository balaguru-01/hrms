import sendUserInvitationService from "../services/invitationServices.js";
import userRegistrationService from "../services/userRegistrationService.js";
import fetchRoles from "../services/roleFetchServices.js";
import fetchUsers from "../services/userFetchServices.js";
import {getSentInvitationsService} from "../services/getSentInvitationsService.js";

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

export const fetchingUsers = async (req, res, next) => {
    try {
        
        const roleName = req.user.role;

        // Scope, status and pagination
        const {
            scope,
            status,
            page = 1,
            limit = 10,
        } = req.query;

        const result = await fetchUsers({
            roleName,
            scope,
            status,
            page,
            limit,
        });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result,
        });
    } catch (error) {
        error.auditDetails = {
            module: "User",
            action: "Fetch",
            reason:
                error.auditReason ||
                error.message,
        };

        next(error);
    }
};

export const getSentInvitations = async (
    req,
    res,
    next
) => {
    try {
        const invitedBy = {
            userId: req.user.userId,
        };

        const {
            page = 1,
            limit = 10,
        } = req.query;

        const result =
            await getSentInvitationsService({
                invitedBy,
                page,
                limit,
            });

        return res.status(200).json({
            success: true,
            message:
                "Sent invitations fetched successfully",
            data: result,
        });
    } catch (error) {
        error.auditDetails = {
            module: "User",
            action: "Fetch",
            reason:
                error.auditReason ||
                error.message,
        };

        next(error);
    }
};