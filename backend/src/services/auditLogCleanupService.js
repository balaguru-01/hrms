import AuditLog from "../models/AuditLog.js";
import dotenv from "dotenv";

const deleteOldAuditLogs = async () => {
    try {
        const retentionDays = Number(
            process.env.AUDIT_LOG_RETENTION_DAYS
        );
        

        if (!Number.isInteger(retentionDays) || retentionDays <= 0) {
            throw new Error(
                "AUDIT_LOG_RETENTION_DAYS must be a positive integer"
            );
        }

        const cutoffDate = new Date();

        cutoffDate.setDate(
            cutoffDate.getDate() - retentionDays
        );

        await AuditLog.deleteMany({
            createdAt: {
                $lt: cutoffDate,
            },
        });


    } 
    catch (error) {
                
        throw error;
    }
};

export default deleteOldAuditLogs;