const mongoose = require("mongoose");

const { MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } = process.env;
const connectionString = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;

module.exports = {
    initConnection: (cb) => {
        mongoose.connect(connectionString, {
            useNewUrlParser: true,
        });
        mongoose.connection.on("error", (err) => {
            console.error("Failed to connect to database");
            console.error(err);
        });
        mongoose.connection.once("open", () => {
            console.log("Successfully connected to the database");
            if (cb) {
                cb();
            }
        });
    },
};
