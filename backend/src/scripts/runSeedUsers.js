require("dotenv").config();

const connectDB = require("../config/database");

const { seedUsers } = require("./seedUsers");

(async () => {

    try {

        await connectDB();

        await seedUsers();

        process.exit(0);

    }
    catch (error) {

        console.error(error);

        process.exit(1);

    }

})();