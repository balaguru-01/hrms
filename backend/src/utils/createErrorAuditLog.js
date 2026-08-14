import AuditLog from "../models/AuditLog.js";

const createErrorAuditLog = async ({
    req,
    auditDetails,
}) => {
    try {
        await AuditLog.create({
            tenant: auditDetails.tenant || null,

            performedBy: {
                userId: req.user?.userId || null,

                name: req.user
                    ? `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim()
                    : null,

                role: req.user?.role || null,

                designation: req.user?.designation || null,
            },

            module: auditDetails.module,

            action: auditDetails.action,

            relatedTo: {
                module: auditDetails.module,
                referenceId: null,
                title: "",
            },

            changes: {
                oldData: null,
                newData: null,
            },

            description: auditDetails.reason,

            ipAddress: req.ip || "",

            userAgent: req.get("user-agent") || "",

            status: "Failed",

            isActive: true,
            isDeleted: false,
        });
    } 
    catch (auditError) 
    {
        // Audit failure should not break the original API response
        console.error(
            "Failed to create error audit log:",
            auditError
        );
    }
};

export default createErrorAuditLog;