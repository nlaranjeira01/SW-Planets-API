const { ApiError, InternalServerError } = require("../errors");

const { NODE_ENV: environment } = process.env;

const errorHandlerMiddleware = (req, res, next) => {
    res.handleError = (error) => {
        const stacktrace = error.stack;
        const e = error instanceof ApiError ? error : new InternalServerError();

        return res.status(e.status).send({
            error: e.message,
            stacktrace:
                environment === "development" || environment === "test"
                    ? stacktrace
                    : undefined,
        });
    };

    next();
};

const middlewareWrapper = () => errorHandlerMiddleware;

module.exports = {
    errorHandler: middlewareWrapper,
};
