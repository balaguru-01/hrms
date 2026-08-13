import createErrorAuditLog from "../utils/createErrorAuditLog.js";

const errorHandler = async (err, req, res, next) => {

    if (err.auditDetails) {
        await createErrorAuditLog({
            req,
            auditDetails: err.auditDetails,
        });
    }

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        status: false,
        message: err.message || "Internal Server Error",
    });
};

export default errorHandler;