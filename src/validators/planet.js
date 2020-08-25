const Joi = require("joi");
const { Types } = require("mongoose");
const { ValidationError } = require("../errors");

const planetBodySchema = Joi.object().keys({
    name: Joi.string().required(),
    terrain: Joi.string(),
    climate: Joi.string(),
});

/*
    TODO: colocar mensagens de erro mais descritivas
*/

function planetBodyValidator(req, res, next) {
    const result = planetBodySchema.validate(req.body);

    if (result.error instanceof Joi.ValidationError) {
        return res.handleError(new ValidationError());
    }

    return next();
}

function idParamValidator(req, res, next) {
    if (!Types.ObjectId.isValid(req.params.id)) {
        return res.handleError(new ValidationError());
    }

    return next();
}

// com mais serviços esse validador poderia ser refatorado para outro arquivo mais genérico
function nameParamValidator(req, res, next) {
    if (
        !(
            typeof req.params.name === "string" ||
            req.params.name instanceof String
        )
    ) {
        return res.handleError(new ValidationError());
    }

    return next();
}

module.exports = {
    planetBody: planetBodyValidator,
    idParam: idParamValidator,
    nameParam: nameParamValidator,
};
