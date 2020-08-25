const planetValidator = require("./planet");
const { ValidationError } = require("../errors");

describe("Planet Validator", () => {
    it("should return true if the planet has a name when validating body", () => {
        const planetInfo = {
            body: {
                name: "Yavin IV",
            },
        };

        const next = jest.fn();
        planetValidator.planetBody(planetInfo, null, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should call res.handleError with ValidationError if the planet has no name when validating body", () => {
        const planetInfo = {
            body: {
                terrain: "jungle",
                climate: "temperate",
            },
        };

        const resMock = {
            handleError: jest.fn(),
        };

        planetValidator.planetBody(planetInfo, resMock);

        expect(resMock.handleError).toHaveBeenCalledTimes(1);
        expect(
            resMock.handleError.mock.calls[0][0] instanceof ValidationError
        ).toBe(true);
    });

    it("should call res.handleError with ValidationError if the id is not a valid ObjectID", () => {
        const planetInfo = {
            params: {
                id: "some string",
            },
        };

        const resMock = {
            handleError: jest.fn(),
        };

        planetValidator.idParam(planetInfo, resMock);

        expect(resMock.handleError).toHaveBeenCalledTimes(1);
        expect(
            resMock.handleError.mock.calls[0][0] instanceof ValidationError
        ).toBe(true);
    });

    it("should go to next middleware id is a valid ObjectID", () => {
        const planetInfo = {
            params: {
                id: "5f4459df8ee5314e8a7c0bcb",
            },
        };

        const next = jest.fn();
        planetValidator.idParam(planetInfo, null, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should call res.handleError with ValidationError if the name is not a string", () => {
        const planetInfo = {
            params: {
                name: null,
            },
        };
        const resMock = {
            handleError: jest.fn(),
        };

        planetValidator.nameParam(planetInfo, resMock);

        expect(resMock.handleError).toHaveBeenCalledTimes(1);
        expect(
            resMock.handleError.mock.calls[0][0] instanceof ValidationError
        ).toBe(true);
    });

    it("should go to next middleware if the name is a string", () => {
        const planetInfo = {
            params: {
                name: "Yavin IV",
            },
        };

        const next = jest.fn();
        planetValidator.nameParam(planetInfo, null, next);

        expect(next).toHaveBeenCalledTimes(1);
    });
});
