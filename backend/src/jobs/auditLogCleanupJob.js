import cron from "node-cron";
import deleteOldAuditLogs from "../services/auditLogCleanupService.js";

const startAuditLogCleanupJob = () => {
    cron.schedule(
        "0 0 * * *",
        async () => {

            try {
                await deleteOldAuditLogs();
            } 
            catch (error) {
                console.error(
                    error.message
                );
            }
        },
        {
            timezone: "Asia/Kolkata",
            noOverlap: true,
        }
    );

   
};

export default startAuditLogCleanupJob;