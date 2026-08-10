import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/database.js";

import "./models/Tenant.js";
import "./models/Role.js";
import "./models/User.js";
import "./models/Department.js";
import "./models/Permission.js";
import "./models/Task.js";
import "./models/Request.js";
import "./models/Attendance.js";
import "./models/Notification.js";
import "./models/AuditLog.js";
import "./models/Plans.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();