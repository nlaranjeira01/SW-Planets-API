require("dotenv").config();
const { app } = require("./app");

const { SERVER_PORT: serverPort } = process.env;

app.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}`);
});
