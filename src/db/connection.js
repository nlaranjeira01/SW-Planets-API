const mongoose = require("mongoose");

const { MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } = process.env;
const connectionString = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;

module.exports = {
    initConnection: (cb) => {
        mongoose.connection.on("disconnecting", () => {
            console.log("Disconnecting from the database");
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

        return mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    },
};
