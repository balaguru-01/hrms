require("dotenv").config();

const connectDB = require("../config/database");

const { seedRoles } = require("./seedRoles");

(async () => {

    try {

        await connectDB();

        await seedRoles();

        process.exit(0);

    }
    catch (error) {

        console.error(error);

        process.exit(1);

    }

})();