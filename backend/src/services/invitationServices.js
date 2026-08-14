import mongoose from "mongoose";

import User from "../models/User.js";
import Role from "../models/Role.js";
import Tenant from "../models/Tenant.js";
import AuditLog from "../models/AuditLog.js";

import constants from "../config/constants.js";
import generateToken from "../utils/tokenGenerator.js";
import userInvitationEmail from "../utils/mailServices/userInvitationEmail.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendUserInvitationService = async ({
    email,
    roleId,
    orgName = null,
    invitedBy,
}) => {

    // Validate email
    if (!email || typeof email !== "string" || email.trim() === "") {
        const error = new Error("Invalid data");
        error.statusCode = 400;
        error.auditReason = "Email is required";
        throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
        const error = new Error("Invalid data");
        error.statusCode = 400;
        error.auditReason = "Invalid email address";
        throw error;
    }

    // Validate roleId
    if (!roleId) {
        const error = new Error("Invalid data");
        error.statusCode = 400;
        error.auditReason = "Role is required";
        throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
        const error = new Error("Invalid data");
        error.statusCode = 400;
        error.auditReason = "Invalid role ID";
        throw error;
    }

    // Find requested role
    const targetRole = await Role.findOne({
        _id: roleId,
        isActive: true,
        isDeleted: false,
    }).lean();

    if (!targetRole) {
        const error = new Error("Request failed");
        error.statusCode = 404;
        error.auditReason =
            "Requested role was not found or is inactive";
        throw error;
    }

    // Find the user who is sending the invitation
    const inviter = await User.findOne({
        _id: invitedBy.userId,
        isDeleted: false,
    }).lean();

    if (!inviter) {
        const error = new Error("Request failed");
        error.statusCode = 404;
        error.auditReason = "Inviting user was not found";
        throw error;
    }

    // Get inviter's role
    const inviterRole = inviter.role?.name;

    if (!inviterRole) {
        const error = new Error("Request failed");
        error.statusCode = 400;
        error.auditReason = "Inviting user's role was not found";
        throw error;
    }

    // Check whether inviter is allowed to create requested role
    const allowedRoles =
        constants.roleHierarchy[inviterRole] || [];

    if (!allowedRoles.includes(targetRole.name)) {
        const error = new Error("Request failed");
        error.statusCode = 403;
        error.auditReason =
            `User with role ${inviterRole} is not authorized to create ${targetRole.name}`;
        throw error;
    }

    // Determine whether target role requires a tenant
    const tenantLevelRoles = [
        constants.roles.tenantSuperAdmin,
        constants.roles.tenantAdmin,
        constants.roles.tenantUser
    ];

    const requiresTenant = tenantLevelRoles.includes(
        targetRole.name
    );

    let tenant = null;

    // Determine tenant
    if (requiresTenant) {

        // Tenant-level user creating another tenant-level user
        if (inviter.tenant?.tenantId) {

            const tenantRecord = await Tenant.findOne({
                _id: inviter.tenant.tenantId,
                isActive: true,
                isDeleted: false,
            }).lean();

            if (!tenantRecord) {
                const error = new Error("Resource not found");
                error.statusCode = 404;
                error.auditReason =
                    "Inviting user's organization was not found or is inactive";
                throw error;
            }

            tenant = {
                tenantId: tenantRecord._id,
                orgName: tenantRecord.orgName,
                email: tenantRecord.email,
            };
        }

        // Enterprise-level user creating tenant-level user
        else {

            if (!orgName || orgName.trim() === "") {
                const error = new Error("Invalid data");
                error.statusCode = 400;
                error.auditReason =
                    "Organization name is required for this role";
                throw error;
            }

            const normalizedOrgName = orgName.trim();

            const tenantRecord = await Tenant.findOne({
                orgName: normalizedOrgName,
                isActive: true,
                isDeleted: false,
            }).lean();

            if (!tenantRecord) {
                const error = new Error("Resource not found");
                error.statusCode = 404;
                error.auditReason =
                    "Organization was not found or is inactive";
                throw error;
            }

            tenant = {
                tenantId: tenantRecord._id,
                orgName: tenantRecord.orgName,
                email: tenantRecord.email,
            };
        }
    }

    // Global email uniqueness
    const existingUser = await User.findOne({
        email: normalizedEmail,
        isDeleted: false,
    }).lean();

    if (existingUser) {
        const error = new Error("Request failed");
        error.statusCode = 409;
        error.auditReason =
            "A user with this email already exists";
        throw error;
    }

    // Invitation token payload
    const payload = {
        purpose: "UserRegistration",

        email: normalizedEmail,

        role: {
            roleId: targetRole._id,
            name: targetRole.name,
        },

        ...(tenant && {
            tenant: {
                tenantId: tenant.tenantId,
                orgName: tenant.orgName,
                email: tenant.email,
            },
        }),

        invitedBy: {
            userId: inviter._id,
            name: `${inviter.firstName} ${inviter.lastName}`,
            role: inviter.role.name,
        },
    };

    // Generate invitation token
    const token = generateToken(payload, "24h");

    // Send invitation email
    try {

        await userInvitationEmail(
            normalizedEmail,
            token
        );

        // Successful invitation audit log
        await AuditLog.create({
            tenant: tenant,

            performedBy: {
                userId: inviter._id,
                name: `${inviter.firstName} ${inviter.lastName}`,
                role: inviter.role.name,
                designation: inviter.designation,
            },

            module: "User",

            action: "Invite",

            relatedTo: {
                module: "User",
                referenceId: null,
                title: normalizedEmail,
            },

            changes: {
                oldData: null,

                newData: {
                    email: normalizedEmail,
                    role: targetRole.name,
                    tenant: tenant?.orgName || null,
                    invitationStatus: "Sent",
                },
            },

            description:
                `User invitation email sent successfully for ${targetRole.name} role to ${normalizedEmail}`,

            status: "Success",

            isActive: true,
            isDeleted: false,
        });

    } catch (error) {

        const invitationError = new Error(
            "Failed to send invitation"
        );

        invitationError.statusCode = 500;
        invitationError.auditReason = error.message;

        throw invitationError;
    }

    // Return result
    return {
        email: normalizedEmail,
        role: targetRole.name,
        tenant: tenant?.orgName || null,
        invitationSent: true,
    };
};

export default sendUserInvitationService;