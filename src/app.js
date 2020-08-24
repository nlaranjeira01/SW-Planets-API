const express = require("express");
const bodyParser = require("body-parser");

const { EndpointNotFoundError } = require("./errors");
const { errorHandler } = require("./middlewares");

const app = express();

app.use(bodyParser.json());
app.use(errorHandler());

app.use((req, res) => {
    res.handleError(new EndpointNotFoundError());
});

module.exports = {
    app,
};
