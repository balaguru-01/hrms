import generateToken from "../utils/tokenGenerator.js";

import tenantInvitationEmail from "../utils/mailServices/tenantInvitationEmail.js";

import AuditLog from "../models/AuditLog.js";

import Tenant from "../models/Tenant.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const tenantInvitationService = async ({
    organizationName,
    email,
    invitedBy,
}) => {

    // ---------------------------------------
    // 1. Validate organization name
    // ---------------------------------------

    if (
        !organizationName ||
        typeof organizationName !== "string"
    ) {
        const error = new Error(
            "Organization name is required."
        );

        error.statusCode = 400;

        error.auditReason =
            "Missing organization name";

        throw error;
    }

    // Only lowercase letters are allowed
    const normalizedOrganizationName =
        organizationName
            .trim()
            .toLowerCase()
            .replace(/[^a-z]/g, "");

    if (!normalizedOrganizationName) {
        const error = new Error(
            "Organization name must contain lowercase letters only."
        );

        error.statusCode = 400;

        error.auditReason =
            "Invalid organization name";

        throw error;
    }

    // ---------------------------------------
    // 2. Validate email
    // ---------------------------------------

    if (
        !email ||
        typeof email !== "string"
    ) {
        const error = new Error(
            "Email is required."
        );

        error.statusCode = 400;

        error.auditReason =
            "Missing email";

        throw error;
    }

    const normalizedEmail =
        email.trim().toLowerCase();

    if (
        !emailRegex.test(
            normalizedEmail
        )
    ) {
        const error = new Error(
            "Please enter a valid email address."
        );

        error.statusCode = 400;

        error.auditReason =
            "Invalid email address";

        throw error;
    }

    // ---------------------------------------
    // 3. Validate inviter information
    // ---------------------------------------

    if (
        !invitedBy ||
        !invitedBy.userId ||
        !invitedBy.role
    ) {
        const error = new Error(
            "Inviter information is required."
        );

        error.statusCode = 400;

        error.auditReason =
            "Missing inviter information";

        throw error;
    }

    // ---------------------------------------
    // 4. Create / Restore Pending Tenant
    // ---------------------------------------

    let newTenant;

    // Used when email sending fails.
    let tenantNeedsCleanup = false;

    try {

        // ---------------------------------------
        // Find tenant by email
        // ---------------------------------------
        //
        // IMPORTANT:
        // Do NOT filter isDeleted here.
        // We need to know whether the email exists
        // even when the old record was soft deleted.
        // ---------------------------------------

        const existingTenant =
            await Tenant.findOne({
                email: normalizedEmail,
            });

        console.log(
            "========================================"
        );

        console.log(
            "TENANT INVITATION EMAIL CHECK"
        );

        console.log(
            "Normalized Email:",
            normalizedEmail
        );

        console.log(
            "Existing Tenant:",
            existingTenant
        );

        console.log(
            "========================================"
        );

        // ---------------------------------------
        // Existing tenant that is NOT deleted
        // ---------------------------------------
        //
        // This means the email is already attached
        // to an active/pending tenant record.
        // ---------------------------------------

        if (
            existingTenant &&
            existingTenant.isDeleted !== true
        ) {

            const error = new Error(
                "An invitation has already been sent to this email address."
            );

            error.statusCode = 409;

            error.auditReason =
                "Tenant invitation already sent";

            throw error;
        }

        // ---------------------------------------
        // Existing tenant but deleted
        // ---------------------------------------
        //
        // Reuse the old record instead of creating
        // another record with the same unique email.
        // ---------------------------------------

        if (
            existingTenant &&
            existingTenant.isDeleted === true
        ) {

            newTenant =
                existingTenant;

            newTenant.orgName =
                normalizedOrganizationName;

            newTenant.employeeCount =
                newTenant.employeeCount ?? 0;

            // Keep the existing subscription object
            // because it may contain nested plan data.
            if (
                !newTenant.subscription
            ) {
                newTenant.subscription = {};
            }

            newTenant.subscription.status =
                "Pending";

            if (
                newTenant.subscription
                    .employeeLimit ===
                    undefined ||
                newTenant.subscription
                    .employeeLimit ===
                    null
            ) {
                newTenant.subscription.employeeLimit =
                    10;
            }

            newTenant.createdBy = {
                userId:
                    invitedBy.userId,

                name:
                    invitedBy.name ||
                    null,

                role:
                    invitedBy.role ||
                    "",
            };

            newTenant.isActive =
                false;

            newTenant.isDeleted =
                false;

            await newTenant.save();

            tenantNeedsCleanup =
                true;

        } else {

            // ---------------------------------------
            // No tenant exists
            // ---------------------------------------
            //
            // Create a completely new tenant.
            // ---------------------------------------

            newTenant =
                await Tenant.create({

                    orgName:
                        normalizedOrganizationName,

                    email:
                        normalizedEmail,

                    employeeCount:
                        0,

                    subscription: {
                        status:
                            "Pending",
                    },

                    createdBy: {
                        userId:
                            invitedBy.userId,

                        name:
                            invitedBy.name ||
                            null,

                        role:
                            invitedBy.role ||
                            "",
                    },

                    updatedBy: {
                        userId:
                            null,

                        name:
                            null,

                        role:
                            null,
                    },

                    isActive:
                        false,

                    isDeleted:
                        false,
                });

            tenantNeedsCleanup =
                true;
        }

    } catch (error) {

        console.error(
            "Tenant creation failed:",
            error
        );

        // ---------------------------------------
        // Handle MongoDB duplicate key
        // ---------------------------------------

        if (error.code === 11000) {

            console.log(
                "========================================"
            );

            console.log(
                "DUPLICATE ERROR DETECTED"
            );

            console.log(
                "Duplicate Field:",
                error.keyPattern
            );

            console.log(
                "Duplicate Value:",
                error.keyValue
            );

            console.log(
                "========================================"
            );

            const duplicateFields =
                Object.keys(
                    error.keyPattern || {}
                );

            const duplicateField =
                duplicateFields[0];

            let duplicateMessage =
                "Duplicate tenant data already exists.";

            if (
                duplicateField ===
                "email"
            ) {
                duplicateMessage =
                    "An invitation has already been sent to this email address.";
            }

            if (
                duplicateField ===
                "orgName"
            ) {
                duplicateMessage =
                    "An organization with this name already exists.";
            }

            if (
                duplicateField ===
                "companyCode"
            ) {
                duplicateMessage =
                    "This company code already exists.";
            }

            const duplicateError =
                new Error(
                    duplicateMessage
                );

            duplicateError.statusCode =
                409;

            duplicateError.auditReason =
                `Duplicate tenant field: ${
                    duplicateField ||
                    "unknown"
                }`;

            throw duplicateError;
        }

        // ---------------------------------------
        // Pass custom application errors
        // ---------------------------------------

        if (error.statusCode) {
            throw error;
        }

        // ---------------------------------------
        // Other database errors
        // ---------------------------------------

        const tenantError =
            new Error(
                "Unable to create pending tenant."
            );

        tenantError.statusCode =
            500;

        tenantError.auditReason =
            error.message ||
            "Tenant creation failed";

        throw tenantError;
    }

    // ---------------------------------------
    // 5. Generate Invitation Token
    // ---------------------------------------

    const token =
        generateToken(
            {
                purpose:
                    "TenantInvitation",

                tenant: {
                    tenantId:
                        newTenant._id,

                    orgName:
                        normalizedOrganizationName,

                    email:
                        normalizedEmail,
                },

                organizationName:
                    normalizedOrganizationName,

                email:
                    normalizedEmail,

                invitedBy: {
                    userId:
                        invitedBy.userId,

                    name:
                        invitedBy.name ||
                        "",

                    role:
                        invitedBy.role ||
                        "",
                },
            },

            "2h"
        );

    // ---------------------------------------
    // 6. Send Invitation Email
    // ---------------------------------------

    try {

        await tenantInvitationEmail(
            normalizedEmail,
            token,
            normalizedOrganizationName
        );

    } catch (error) {

        // Email failed.
        // Hide the tenant again so the same email
        // can be invited again later.

        if (tenantNeedsCleanup) {

            try {

                await Tenant.findByIdAndUpdate(
                    newTenant._id,
                    {
                        isDeleted:
                            true,

                        isActive:
                            false,
                    }
                );

            } catch (
                cleanupError
            ) {

                console.error(
                    "Failed to cleanup pending tenant:",
                    cleanupError
                );
            }
        }

        const mailError =
            new Error(
                "Unable to send tenant invitation email."
            );

        mailError.statusCode =
            500;

        mailError.auditReason =
            error.message ||
            "Tenant invitation email failed";

        throw mailError;
    }

    // ---------------------------------------
    // 7. Store Invitation in AuditLog
    // ---------------------------------------

    try {

        await AuditLog.create({

            tenant: {
                tenantId:
                    newTenant._id,

                orgName:
                    normalizedOrganizationName,

                email:
                    normalizedEmail,
            },

            performedBy: {
                userId:
                    invitedBy.userId,

                name:
                    invitedBy.name ||
                    "",

                role:
                    invitedBy.role ||
                    "",

                designation:
                    invitedBy.designation ||
                    null,
            },

            module:
                "Tenant",

            action:
                "Invite",

            relatedTo: {
                module:
                    "TenantInvitation",

                referenceId:
                    newTenant._id,

                title:
                    normalizedOrganizationName,
            },

            changes: {

                oldData:
                    null,

                newData: {

                    organizationName:
                        normalizedOrganizationName,

                    email:
                        normalizedEmail,

                    tenantId:
                        newTenant._id,

                    invitationStatus:
                        "Sent",

                    tenantStatus:
                        "Pending",
                },
            },

            description:
                `Tenant invitation email sent successfully to ${normalizedEmail}`,

            status:
                "Success",

            isActive:
                true,

            isDeleted:
                false,
        });

    } catch (error) {

        // Email has already been sent.
        // Audit failure should not make the
        // invitation look unsuccessful.

        console.error(
            "Tenant invitation audit log failed:",
            error
        );
    }

    // ---------------------------------------
    // 8. Return Success Response
    // ---------------------------------------

    return {

        tenantId:
            newTenant._id,

        organizationName:
            normalizedOrganizationName,

        email:
            normalizedEmail,

        invitationSent:
            true,
    };
};

export default tenantInvitationService;