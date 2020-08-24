const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const ApiError = require("./api-error");

module.exports = class InternalServerError extends ApiError {
    constructor(message) {
        super(
            StatusCodes.INTERNAL_SERVER_ERROR,
            message || ReasonPhrases.INTERNAL_SERVER_ERROR
        );
    }
};
