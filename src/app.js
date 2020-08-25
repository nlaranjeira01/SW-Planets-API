const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger");
const { EndpointNotFoundError } = require("./errors");
const { errorHandler } = require("./middlewares");
const router = require("./routers");

const app = express();

app.use(bodyParser.json());
app.use(errorHandler());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", router);
app.use((req, res) => {
    res.handleError(new EndpointNotFoundError());
});

module.exports = app;
