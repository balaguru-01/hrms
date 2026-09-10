import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Role from "../models/Role.js";
import Tenant from "../models/Tenant.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";

import validateUserCreation from "../utils/inputValidations.js";
import verifyToken from "../utils/tokenVerifier.js";
import generateAvatarUrl from "../utils/avatarGenerator.js";

const userRegistrationService = async ({
    token,
    firstName,
    lastName,
    email,
    password,
    phone,
    location,
}) => {
    // Checking token exists
    if (!token) {
        const error = new Error("Invalid request");
        error.auditReason = "Invitation Token not found";
        error.statusCode = 404;
        throw error;
    }

    // Verifying invitation token
    const tokenPayload = verifyToken(token);

    if (!tokenPayload) {
        const error = new Error("Invalid request");
        error.auditReason = "Token payload not found";
        error.statusCode = 400;
        throw error;
    }

    // Check token purpose
    if (tokenPayload.purpose !== "UserRegistration") {
        const error = new Error("Invalid request");
        error.auditReason = "Invalid invitation token";
        error.statusCode = 400;
        throw error;
    }

    // Validate submitted user details
    validateUserCreation({
        firstName,
        lastName,
        email,
        password,
        phone,
        location,
    });

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Verify email against token
    if (normalizedEmail !== tokenPayload.email) {
        const error = new Error("Invalid data");
        error.auditReason =
            "Email does not match the invitation";
        error.statusCode = 400;
        throw error;
    }

    /*
     * Find the invited user.
     *
     * invitationToken is select:false in User schema,
     * so we explicitly select it here.
     */
    const invitedUser = await User.findOne({
        email: normalizedEmail,
        isDeleted: false,
    })
        .select("+invitationToken")
        .lean();

    // User must already exist because invitation creates the user
    if (!invitedUser) {
        const error = new Error("Invalid request");
        error.auditReason =
            "No invited user was found for this email";
        error.statusCode = 404;
        throw error;
    }

    // User must currently be in Invited status
    if (invitedUser.status !== "Invited") {
        const error = new Error("Invalid request");
        error.auditReason =
            `User cannot complete registration because current status is ${invitedUser.status}`;
        error.statusCode = 409;
        throw error;
    }

    // Verify submitted token against stored invitation token
    if (
        !invitedUser.invitationToken ||
        invitedUser.invitationToken !== token
    ) {
        const error = new Error("Invalid request");
        error.auditReason =
            "Invitation token does not match the stored token";
        error.statusCode = 400;
        throw error;
    }

    // Verify invitation expiry stored in database
    if (
        !invitedUser.invitationTokenExpiresAt ||
        new Date(invitedUser.invitationTokenExpiresAt) <=
            new Date()
    ) {
        const error = new Error("Invalid request");
        error.auditReason = "Invitation token has expired";
        error.statusCode = 401;
        throw error;
    }

    // Get role from token
    if (
        !tokenPayload.role ||
        !tokenPayload.role.roleId ||
        !tokenPayload.role.name ||
        !mongoose.Types.ObjectId.isValid(
            tokenPayload.role.roleId
        )
    ) {
        const error = new Error("Invalid data");
        error.auditReason =
            "Invalid role information in invitation";
        error.statusCode = 400;
        throw error;
    }

    const userRole = await Role.findOne({
        _id: tokenPayload.role.roleId,
        name: tokenPayload.role.name,
        isActive: true,
        isDeleted: false,
    }).lean();

    if (!userRole) {
        const error = new Error("Invalid data");
        error.auditReason =
            "The invited role is no longer available";
        error.statusCode = 404;
        throw error;
    }

    // Validate the role stored in the invited User
    if (
        !invitedUser.role ||
        !invitedUser.role.roleId ||
        !invitedUser.role.name ||
        invitedUser.role.roleId.toString() !==
            userRole._id.toString() ||
        invitedUser.role.name !== userRole.name
    ) {
        const error = new Error("Invalid data");
        error.auditReason =
            "Stored user role does not match the invitation";
        error.statusCode = 400;
        throw error;
    }

    // Validate designation from invitation
    if (
        !tokenPayload.designation ||
        tokenPayload.designation.trim() === ""
    ) {
        const error = new Error("Invalid data");
        error.auditReason = "Invalid designation";
        error.statusCode = 400;
        throw error;
    }

    const normalizedDesignation =
        tokenPayload.designation.trim();

    // Validate designation stored in invited User
    if (
        invitedUser.designation !==
        normalizedDesignation
    ) {
        const error = new Error("Invalid data");
        error.auditReason =
            "Stored designation does not match the invitation";
        error.statusCode = 400;
        throw error;
    }

    // Validate inviter information from token
    if (
        !tokenPayload.invitedBy ||
        !tokenPayload.invitedBy.userId ||
        !tokenPayload.invitedBy.name ||
        !tokenPayload.invitedBy.role ||
        !mongoose.Types.ObjectId.isValid(
            tokenPayload.invitedBy.userId
        )
    ) {
        const error = new Error("Invalid data");
        error.auditReason =
            "Invalid inviter information in invitation";
        error.statusCode = 400;
        throw error;
    }

    const inviter = await User.findOne({
        _id: tokenPayload.invitedBy.userId,
        isActive: true,
        isDeleted: false,
    });

    if (!inviter) {
        const error = new Error("Invalid data");
        error.auditReason = "Unable to find the inviter";
        error.statusCode = 404;
        throw error;
    }

    // Get tenant information from token
    let userTenant = null;

    if (tokenPayload.tenant) {
        if (!tokenPayload.tenant.tenantId) {
            const error = new Error("Invalid data");
            error.auditReason =
                "Invalid tenant information in invitation";
            error.statusCode = 400;
            throw error;
        }

        const tenant = await Tenant.findOne({
            _id: tokenPayload.tenant.tenantId,
            isDeleted: false,
            isActive: true,
        }).lean();

        if (!tenant) {
            const error = new Error("Invalid data");
            error.auditReason = "Tenant not found";
            error.statusCode = 404;
            throw error;
        }

        userTenant = {
            tenantId: tenant._id,
            orgName: tenant.orgName,
            email: tenant.email,
        };
    }

    // Validate tenant against the invited User
    if (userTenant) {
        if (
            !invitedUser.tenant ||
            !invitedUser.tenant.tenantId ||
            invitedUser.tenant.tenantId.toString() !==
                userTenant.tenantId.toString()
        ) {
            const error = new Error("Invalid data");
            error.auditReason =
                "Stored tenant does not match the invitation";
            error.statusCode = 400;
            throw error;
        }
    }

    // Check duplicate phone
    const existingPhone = await User.findOne({
        phone: phone.trim(),
        isDeleted: false,
        _id: {
            $ne: invitedUser._id,
        },
    }).lean();

    if (existingPhone) {
        const error = new Error("Invalid data");
        error.auditReason =
            "Phone number already exists";
        error.statusCode = 409;
        throw error;
    }

    // Avatar Generator
    const avatarUrl = generateAvatarUrl(
        firstName,
        lastName
    );

    if (!avatarUrl || avatarUrl.trim() === "") {
        const error = new Error("Invalid data");
        error.auditReason =
            "Not able to create avatar";
        error.statusCode = 400;
        throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
        password.trim(),
        10
    );

    // Start transaction
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        /*
         * Update the existing invited User.
         */
        const registeredUser =
            await User.findOneAndUpdate(
                {
                    _id: invitedUser._id,
                    email: normalizedEmail,
                    status: "Invited",
                    invitationToken: token,
                    invitationTokenExpiresAt: {
                        $gt: new Date(),
                    },
                    isDeleted: false,
                },
                {
                    $set: {
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        password: hashedPassword,
                        phone: phone.trim(),
                        location:
                            location?.trim() || null,
                        profilePicture:
                            avatarUrl.trim(),

                        status: "Pending",
                        isActive: false,

                        updatedBy: {
                            userId: null,
                            name: "System",
                            role: "System",
                        },
                    },

                    /*
                     * Clear invitation token after
                     * successful registration.
                     */
                    $unset: {
                        invitationToken: "",
                        invitationTokenExpiresAt: "",
                    },
                },
                {
                    new: true,
                    session,
                }
            );

        /*
         * If no document was updated, something changed
         * between validation and update.
         */
        if (!registeredUser) {
            const error = new Error("Invalid data");
            error.auditReason =
                "Invitation is no longer valid";
            error.statusCode = 409;
            throw error;
        }

        // Create audit log
        await AuditLog.create(
            [
                {
                    /*
                     * Only add tenant information when
                     * the registered user actually belongs
                     * to a tenant.
                     */
                    ...(registeredUser.tenant?.tenantId && {
                        tenant: {
                            tenantId:
                                registeredUser.tenant
                                    .tenantId,
                            orgName:
                                registeredUser.tenant
                                    .orgName,
                            email:
                                registeredUser.tenant
                                    .email,
                        },
                    }),

                    performedBy: {
                        userId: null,
                        name: "System",
                        role: "System",
                        designation: null,
                    },

                    module: "User",

                    action: "Submit",

                    relatedTo: {
                        module: "User",
                        referenceId:
                            registeredUser._id,
                        title: `${registeredUser.firstName} ${registeredUser.lastName}`,
                    },

                    changes: {
                        oldData: {
                            firstName:
                                invitedUser.firstName ||
                                null,

                            lastName:
                                invitedUser.lastName ||
                                null,

                            email:
                                invitedUser.email,

                            phone:
                                invitedUser.phone ||
                                null,

                            role:
                                invitedUser.role?.name,

                            location:
                                invitedUser.location ||
                                null,

                            designation:
                                invitedUser.designation,

                            status:
                                invitedUser.status,

                            isActive:
                                invitedUser.isActive,
                        },

                        newData: {
                            firstName:
                                registeredUser.firstName,

                            lastName:
                                registeredUser.lastName,

                            email:
                                registeredUser.email,

                            phone:
                                registeredUser.phone,

                            role:
                                registeredUser.role.name,

                            location:
                                registeredUser.location,

                            designation:
                                registeredUser.designation,

                            profilePicture:
                                registeredUser.profilePicture,

                            status:
                                registeredUser.status,

                            isActive:
                                registeredUser.isActive,
                        },
                    },

                    description:
                        `User registration submitted for ${registeredUser.role.name}. Account is pending approval.`,

                    status: "Success",

                    isActive: true,

                    isDeleted: false,
                },
            ],
            { session }
        );

        // Create notification for inviter
await Notification.create(
    [
        {
            ...(registeredUser.tenant?.tenantId && {
                tenant: {
                    tenantId:
                        registeredUser.tenant.tenantId,
                    orgName:
                        registeredUser.tenant.orgName,
                    email:
                        registeredUser.tenant.email,
                },
            }),

            sender: {
                userId: null,
                name: "System",
                role: "System",
                designation: null,
            },

            recipient: {
                userId: inviter._id,
                name: `${inviter.firstName} ${inviter.lastName}`,
                role: inviter.role.name,
                designation:
                    inviter.designation || null,
            },

            title: "New User Registration",

            message:
                `${registeredUser.firstName} ${registeredUser.lastName} has submitted a registration request and is waiting for your approval.`,

            notificationType: "User",

            relatedTo: {
                module: "User",
                referenceId: registeredUser._id,
                title: `${registeredUser.firstName} ${registeredUser.lastName}`,
            },

            isRead: false,

            isActive: true,

            isDeleted: false,
        },
    ],
    { session }
);

        // Commit transaction
        await session.commitTransaction();

        return {
            userId: registeredUser._id,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
            email: registeredUser.email,
            phone: registeredUser.phone,
            role: registeredUser.role,
            tenant: registeredUser.tenant,
            status: registeredUser.status,
            isActive: registeredUser.isActive,
            invitedBy: tokenPayload.invitedBy,
        };
    } catch (error) {
        // Rollback transaction
        await session.abortTransaction();
        throw error;
    } finally {
        // End session
        await session.endSession();
    }
};

export default userRegistrationService;