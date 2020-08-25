const { StatusCodes } = require("http-status-codes");

const ApiError = require("./api-error");

module.exports = class ResourceNotFoundError extends ApiError {
    constructor(message) {
        super(StatusCodes.NOT_FOUND, message || "Resource not found");
    }
};
