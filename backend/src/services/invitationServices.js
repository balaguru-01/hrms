import mongoose from "mongoose";

import User from "../models/User.js";
import Role from "../models/Role.js";
import Tenant from "../models/Tenant.js";
import AuditLog from "../models/AuditLog.js";
import constants from "../config/constants.js";
import generateToken from "../utils/tokenGenerator.js";
import userInvitationEmail from "../utils/mailServices/userInvitationEmail.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INVITATION_VALIDITY_MS = 24 * 60 * 60 * 1000;

const sendUserInvitationService = async ({
    email,
    roleId,
    orgName = null,
    invitedBy,
    invitedDesignation,
}) => {
    // Validate email
    if (
        !email ||
        typeof email !== "string" ||
        email.trim() === ""
    ) {
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

    // Validate designation
    if (
        !invitedDesignation ||
        typeof invitedDesignation !== "string" ||
        invitedDesignation.trim() === ""
    ) {
        const error = new Error("Invalid data");
        error.statusCode = 400;
        error.auditReason = "Designation is required";
        throw error;
    }

    const normalizedDesignation =
        invitedDesignation.trim();

    if (
        normalizedDesignation.length < 2 ||
        normalizedDesignation.length > 100
    ) {
        const error = new Error("Invalid data");
        error.statusCode = 400;
        error.auditReason =
            "Designation must contain at least 2 characters and should not exceed 100 characters";
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
        error.auditReason =
            "Inviting user's role was not found";
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
        constants.roles.tenantUser,
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
                const error = new Error(
                    "Resource not found"
                );
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
            if (
                !orgName ||
                typeof orgName !== "string" ||
                orgName.trim() === ""
            ) {
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
                const error = new Error(
                    "Resource not found"
                );
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

    // Find existing user
    // invitationToken is explicitly selected because it is select:false
    const existingUser = await User.findOne({
        email: normalizedEmail,
        isDeleted: false,
    })
        .select("+invitationToken")
        .lean();

    
    if (existingUser) {
        if (existingUser.status !== "Invited") {
            const error = new Error("Request failed");
            error.statusCode = 409;
            error.auditReason =
                `User with email ${normalizedEmail} already exists with status ${existingUser.status}`;
            throw error;
        }

        const invitationExpired =
            !existingUser.invitationTokenExpiresAt ||
            new Date(existingUser.invitationTokenExpiresAt) <= new Date();

        if (!invitationExpired) {
            const error = new Error("Request failed");
            error.statusCode = 409;
            error.auditReason =
                "A valid invitation already exists for this email";
            throw error;
        }
    }

    // Invitation token payload
    const payload = {
        purpose: "UserRegistration",
        email: normalizedEmail,
        role: {
            roleId: targetRole._id,
            name: targetRole.name,
        },
        designation: normalizedDesignation,
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
    const token = generateToken(
        payload,
        "24h"
    );

    // Store the matching expiry in the database
    const invitationTokenExpiresAt = new Date(
        Date.now() + INVITATION_VALIDITY_MS
    );

    let invitedUser = null;
    let createdNewUser = false;
    let previousInvitationData = null;

    try {
        /*
         * Create a new temporary user when no user exists.
         */
        if (!existingUser) {
            const [newUser] = await User.create([
                {
                    tenant,
                    email: normalizedEmail,

                    role: {
                        roleId: targetRole._id,
                        name: targetRole.name,
                    },

                    designation: normalizedDesignation,

                    status: "Invited",
                    isActive: false,
                    isDeleted: false,

                    invitationToken: token,
                    invitationTokenExpiresAt,

                    createdBy: {
                        userId: inviter._id,
                        name: `${inviter.firstName} ${inviter.lastName}`,
                        role: inviter.role.name,
                    },

                    updatedBy: {
                        userId: inviter._id,
                        name: `${inviter.firstName} ${inviter.lastName}`,
                        role: inviter.role.name,
                    },
                },
            ]);

            invitedUser = newUser;
            createdNewUser = true;
        }

        /*
         * Existing Invited user whose previous token expired.
         * Replace the old invitation details with the new ones.
         */
        else {
            previousInvitationData = {
                tenant: existingUser.tenant,
                role: existingUser.role,
                designation: existingUser.designation,
                invitationToken:
                    existingUser.invitationToken,
                invitationTokenExpiresAt:
                    existingUser.invitationTokenExpiresAt,
                createdBy: existingUser.createdBy,
                updatedBy: existingUser.updatedBy,
                status: existingUser.status,
                isActive: existingUser.isActive,
            };

            invitedUser =
                await User.findByIdAndUpdate(
                    existingUser._id,
                    {
                        $set: {
                            tenant,
                            role: {
                                roleId: targetRole._id,
                                name: targetRole.name,
                            },
                            designation:
                                normalizedDesignation,

                            status: "Invited",
                            isActive: false,

                            invitationToken: token,
                            invitationTokenExpiresAt,

                            updatedBy: {
                                userId: inviter._id,
                                name: `${inviter.firstName} ${inviter.lastName}`,
                                role: inviter.role.name,
                            },
                        },
                    },
                    {
                        new: true,
                    }
                );
        }

        /*
         * Send invitation email only after the User contains token.
         */
        await userInvitationEmail(
            normalizedEmail,
            token
        );

        // Successful invitation audit log
        await AuditLog.create({
            tenant,
            performedBy: {
                userId: inviter._id,
                name: `${inviter.firstName} ${inviter.lastName}`,
                role: inviter.role.name,
                designation:
                    inviter.designation || null,
            },
            module: "User",
            action: "Invite",
            relatedTo: {
                module: "User",
                referenceId: invitedUser._id,
                title: normalizedEmail,
            },
            changes: {
                oldData: existingUser
                    ? {
                          email: normalizedEmail,
                          status: existingUser.status,
                          invitationTokenExpiresAt:
                              existingUser.invitationTokenExpiresAt,
                      }
                    : null,

                newData: {
                    email: normalizedEmail,
                    role: targetRole.name,
                    designation:
                        normalizedDesignation,
                    tenant:
                        tenant?.orgName || null,
                    status: "Invited",
                    invitationTokenExpiresAt,
                },
            },
            description: existingUser
                ? `Invitation resent successfully for ${targetRole.name} role to ${normalizedEmail} after the previous invitation expired`
                : `User invitation sent successfully for ${targetRole.name} role to ${normalizedEmail}`,
            status: "Success",
            isActive: true,
            isDeleted: false,
        });

        return {
            userId: invitedUser._id,
            email: normalizedEmail,
            role: targetRole.name,
            designation: normalizedDesignation,
            tenant: tenant?.orgName || null,
            status: "Invited",
            invitationSent: true,
        };
    } catch (error) {
        /*
         * If email sending or any operation after User creation/update
         * fails, restore the database state.
         */
        try {
            if (createdNewUser && invitedUser?._id) {
                await User.findByIdAndDelete(
                    invitedUser._id
                );
            } else if (
                existingUser &&
                previousInvitationData
            ) {
                await User.findByIdAndUpdate(
                    existingUser._id,
                    {
                        $set: {
                            tenant:
                                previousInvitationData.tenant,
                            role:
                                previousInvitationData.role,
                            designation:
                                previousInvitationData.designation,

                            status:
                                previousInvitationData.status,
                            isActive:
                                previousInvitationData.isActive,

                            invitationToken:
                                previousInvitationData.invitationToken,
                            invitationTokenExpiresAt:
                                previousInvitationData.invitationTokenExpiresAt,

                            createdBy:
                                previousInvitationData.createdBy,
                            updatedBy:
                                previousInvitationData.updatedBy,
                        },
                    }
                );
            }
        } catch (rollbackError) {
            // Preserve the original error while logging rollback failure
            console.error(
                "Failed to rollback invitation changes:",
                rollbackError
            );
        }

        const invitationError = new Error(
            "Failed to send invitation"
        );

        invitationError.statusCode = 500;
        invitationError.auditReason =
            error.message;

        throw invitationError;
    }
};

export default sendUserInvitationService;