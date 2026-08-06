require("dotenv").config();


const app = require("./app");
const connectDB = require("./config/database");

require("./models/Tenant");
require("./models/Role");
require("./models/User");
require("./models/Department");
require("./models/Permission");
require("./models/Task");
require("./models/Request");
require("./models/Attendance");
require("./models/Notification");
require("./models/AuditLog");
require("./models/Plans")


const PORT = process.env.PORT || 5000;
const startServer = async () => {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
  };



startServer();