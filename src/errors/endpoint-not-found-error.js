const { StatusCodes } = require("http-status-codes");

const ApiError = require("./api-error");

module.exports = class EndpointNotFoundError extends ApiError {
    constructor(message) {
        super(StatusCodes.NOT_FOUND, message || "Endpoint not found");
    }
};
