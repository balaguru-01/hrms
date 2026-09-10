import mongoose from "mongoose";

import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
// We will import the action email service here once created.
// import userActionEmail from "../utils/mailServices/userActionEmail.js";


const ACTION_CONFIG = {
    approve: {
        currentStatus: "Pending",
        newStatus: "Active",
        isActive: true,
        isDeleted: false,
        auditAction: "Approve",
        description: "User account was approved",
    },

    reject: {
        currentStatus: "Pending",
        newStatus: "Rejected",
        isActive: false,
        isDeleted: false,
        auditAction: "Reject",
        description: "User account was rejected",
    },

    "make-inactive": {
        currentStatus: "Active",
        newStatus: "Inactive",
        isActive: false,
        isDeleted: false,
        auditAction: "Update",
        description: "User account was made inactive",
    },

    remove: {
        currentStatus: "Active",
        newStatus: "Deleted",
        isActive: false,
        isDeleted: true,
        auditAction: "Delete",
        description: "Active user was removed",
    },

    delete: {
        currentStatus: "Rejected",
        newStatus: "Deleted",
        isActive: false,
        isDeleted: true,
        auditAction: "Delete",
        description: "Rejected user was deleted",
    },
};


/**
 * Perform a user account action.
 *
 * DB changes and audit log creation are handled
 * inside a MongoDB transaction.
 *
 * Email notification is sent only after the
 * transaction has successfully committed.
 */
export const performUserActionService = async ({
    action,
    userId,
    performedBy,
    requestInfo = {},
}) => {
    const config = ACTION_CONFIG[action];

    if (!config) {
        const error = new Error(`Unsupported user action: ${action}`);
        error.statusCode = 400;
        throw error;
    }

    const session = await mongoose.startSession();

    let updatedUser;
    let previousStatus;

    try {
        session.startTransaction();

        // Find the target user inside the transaction
        const user = await User.findById(userId).session(session);

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Validate the current user status
        if (user.status !== config.currentStatus) {
            const error = new Error(
                `User cannot be ${action} because the current status is ${user.status}`
            );

            error.statusCode = 400;
            throw error;
        }

        // Store the previous status for audit/history/email
        previousStatus = user.status;

        // Capture old state
        const oldData = {
            status: user.status,
            isActive: user.isActive,
            isDeleted: user.isDeleted,
        };

        // Update user account state
        user.status = config.newStatus;
        user.isActive = config.isActive;
        user.isDeleted = config.isDeleted;

        // Store who performed the action
        user.updatedBy = {
            userId: performedBy?.userId || null,
            name: performedBy?.name || null,
            role: performedBy?.role || null,
        };

        await user.save({ session });

        // Capture new state
        const newData = {
            status: user.status,
            isActive: user.isActive,
            isDeleted: user.isDeleted,
        };

        // Create Audit Log inside the same transaction
        await AuditLog.create(
            [
                {
                    tenant: {
                        tenantId: user.tenant?.tenantId || null,
                        orgName: user.tenant?.orgName || null,
                        email: user.tenant?.email || null,
                    },

                    performedBy: {
                        userId: performedBy?.userId || null,
                        name: performedBy?.name || null,
                        role: performedBy?.role || null,
                        designation: performedBy?.designation || null,
                    },

                    module: "User",

                    action: config.auditAction,

                    relatedTo: {
                        module: "User",
                        referenceId: user._id,
                        title: `${user.firstName || ""} ${
                            user.lastName || ""
                        }`.trim(),
                    },

                    changes: {
                        oldData,
                        newData,
                    },

                    description: config.description,

                    ipAddress: requestInfo.ipAddress || "",
                    userAgent: requestInfo.userAgent || "",

                    status: "Success",

                    isActive: true,
                    isDeleted: false,
                },
            ],
            { session }
        );

        // Save the user information that we need after commit
        updatedUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            status: user.status,
            isActive: user.isActive,
            isDeleted: user.isDeleted,
        };

        // Commit User update + AuditLog together
        await session.commitTransaction();
    } catch (error) {
        // Roll back User update + AuditLog
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        throw error;
    } finally {
        await session.endSession();
    }

    /*
     * Email is intentionally sent AFTER the transaction commits.
     *
     * We will connect the action-specific email service here.
     *
     * Example:
     *
     * await userActionEmail({
     *     email: updatedUser.email,
     *     firstName: updatedUser.firstName,
     *     action,
     * });
     */

    return {
        user: updatedUser,
        action,
        previousStatus,
        newStatus: updatedUser.status,
    };
};