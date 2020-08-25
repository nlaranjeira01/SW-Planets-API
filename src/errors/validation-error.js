const { StatusCodes } = require("http-status-codes");

const ApiError = require("./api-error");

module.exports = class ValidationError extends ApiError {
    constructor(message) {
        super(StatusCodes.UNPROCESSABLE_ENTITY, message || "Validation Error");
    }
};
