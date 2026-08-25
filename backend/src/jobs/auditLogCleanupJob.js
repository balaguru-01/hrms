import cron from "node-cron";
import deleteOldAuditLogs from "../services/auditLogCleanupService.js";

const startAuditLogCleanupJob = () => {
    cron.schedule(
        "30 11 * * *",
        async () => {
            console.log(
                "[AuditLog Cleanup] Starting scheduled cleanup..."
            );

            try {
                await deleteOldAuditLogs();

                console.log(
                    "[AuditLog Cleanup] Scheduled cleanup completed."
                );
            } catch (error) {
                console.error(
                    "[AuditLog Cleanup] Scheduled cleanup failed:",
                    error.message
                );
            }
        },
        {
            timezone: "Asia/Kolkata",
            noOverlap: true,
        }
    );

    console.log(
        "[AuditLog Cleanup] cleanup job scheduled."
    );
};

export default startAuditLogCleanupJob;