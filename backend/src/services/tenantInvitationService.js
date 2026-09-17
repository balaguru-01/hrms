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

    if (!emailRegex.test(normalizedEmail)) {
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
    // 4. Create Pending Tenant
    // ---------------------------------------

    let newTenant;

    // Used to know whether this request created
    // or restored a tenant and email failure
    // should therefore hide it again.
    let tenantNeedsCleanup = false;

    try {

        // ---------------------------------------
        // Check active/non-deleted tenant
        // ---------------------------------------

        const existingTenant =
            await Tenant.findOne({
                email: normalizedEmail,
                isDeleted: false,
            });

        if (existingTenant) {

            const error = new Error(
                "An invitation has already been sent to this email address."
            );

            error.statusCode = 409;

            error.auditReason =
                "Tenant invitation already sent";

            throw error;
        }

        // ---------------------------------------
        // Check old deleted tenant
        // ---------------------------------------
        // This can happen when a previous invitation
        // was created but email sending failed.
        //
        // Because email is unique, we reuse that old
        // tenant instead of creating another one.
        // ---------------------------------------

        const deletedTenant =
            await Tenant.findOne({
                email: normalizedEmail,
                isDeleted: true,
            });

        if (deletedTenant) {

            newTenant = deletedTenant;

            newTenant.orgName =
                normalizedOrganizationName;

            newTenant.employeeCount =
                newTenant.employeeCount ?? 0;

            // Do not replace the complete subscription
            // object because it contains nested plan data.
            if (!newTenant.subscription) {
                newTenant.subscription = {};
            }

            newTenant.subscription.status =
                "Pending";

            if (
                newTenant.subscription.employeeLimit ===
                    undefined ||
                newTenant.subscription.employeeLimit ===
                    null
            ) {
                newTenant.subscription.employeeLimit =
                    10;
            }

            newTenant.createdBy = {
                userId:
                    invitedBy.userId,

                name:
                    invitedBy.name || null,

                role:
                    invitedBy.role || "",
            };

            newTenant.isActive = false;

            newTenant.isDeleted = false;

            await newTenant.save();

            tenantNeedsCleanup = true;

        } else {

            // ---------------------------------------
            // Create a brand-new Pending tenant
            // ---------------------------------------

            newTenant = await Tenant.create({

                orgName:
                    normalizedOrganizationName,

                email:
                    normalizedEmail,

                employeeCount:
                    0,

                subscription: {
                    status: "Pending",
                },

                createdBy: {
                    userId:
                        invitedBy.userId,

                    name:
                        invitedBy.name || null,

                    role:
                        invitedBy.role || "",
                },

                updatedBy: {
                    userId: null,
                    name: null,
                    role: null,
                },

                isActive: false,

                isDeleted: false,
            });

            tenantNeedsCleanup = true;
        }

    } catch (error) {

        console.error(
            "Tenant creation failed:",
            error
        );

        // MongoDB duplicate-key protection.
        // This can happen if two invitations for
        // the same email arrive at almost the same time.
        if (error.code === 11000) {

            const duplicateError = new Error(
                "An invitation has already been sent to this email address."
            );

            duplicateError.statusCode = 409;

            duplicateError.auditReason =
                "Duplicate tenant email";

            throw duplicateError;
        }

        if (error.statusCode) {
            throw error;
        }

        const tenantError = new Error(
            "Unable to create pending tenant."
        );

        tenantError.statusCode = 500;

        tenantError.auditReason =
            error.message ||
            "Tenant creation failed";

        throw tenantError;
    }

    // ---------------------------------------
    // 5. Generate invitation token
    // ---------------------------------------

    const token = generateToken(
        {
            purpose: "TenantInvitation",

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
                    invitedBy.name || "",

                role:
                    invitedBy.role || "",
            },
        },

        "2h"
    );

    // ---------------------------------------
    // 6. Send invitation email
    // ---------------------------------------

    try {

        await tenantInvitationEmail(
            normalizedEmail,
            token,
            normalizedOrganizationName
        );

    } catch (error) {

        // Email failed.
        // Hide the tenant again so that the same
        // email can be invited again later.

        if (tenantNeedsCleanup) {

            try {

                await Tenant.findByIdAndUpdate(
                    newTenant._id,
                    {
                        isDeleted: true,
                        isActive: false,
                    }
                );

            } catch (cleanupError) {

                console.error(
                    "Failed to cleanup pending tenant:",
                    cleanupError
                );
            }
        }

        const mailError = new Error(
            "Unable to send tenant invitation email."
        );

        mailError.statusCode = 500;

        mailError.auditReason =
            error.message ||
            "Tenant invitation email failed";

        throw mailError;
    }

    // ---------------------------------------
    // 7. Store invitation in AuditLog
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
                    invitedBy.name || "",

                role:
                    invitedBy.role || "",

                designation:
                    invitedBy.designation || null,
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
        // invitation itself look unsuccessful.

        console.error(
            "Tenant invitation audit log failed:",
            error
        );
    }

    // ---------------------------------------
    // 8. Return success response
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