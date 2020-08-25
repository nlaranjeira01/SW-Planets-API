const request = require("supertest");
const { StatusCodes } = require("http-status-codes");
const PlanetService = require("../services/planet");
const app = require("../app");
const {
    InternalServerError,
    ValidationError,
    EndpointNotFoundError,
} = require("../errors");

jest.mock("../services/planet", () => {
    return {
        findAll: jest.fn(),
        insertOne: jest.fn(),
        findById: jest.fn(),
        findByName: jest.fn(),
        deleteById: jest.fn(),
    };
});

describe("Planet Routes", () => {
    describe("GET /api/planet", () => {
        it("should list planets and status code OK", async () => {
            const planetDocumentArray = [
                {
                    _id: "5f4459df8ee5314e8a7c0bcb",
                    name: "Yavin IV",
                    climate: "temperated",
                    terrain: "jungle",
                    updatedAt: new Date().toString(),
                    filmsCount: 1,
                    __v: 0,
                },
            ];

            PlanetService.findAll.mockResolvedValueOnce(planetDocumentArray);

            const res = await request(app).get("/api/planet");

            expect(res.body).toMatchObject(planetDocumentArray);
            expect(
                res.header["content-type"].includes("application/json")
            ).toBe(true);
            expect(res.statusCode).toBe(StatusCodes.OK);
        });

        it("should handle errors coming from service layer", async () => {
            PlanetService.findAll.mockImplementationOnce(() => {
                throw new Error("Some Error Message");
            });

            const res = await request(app).get("/api/planet");
            const expectedErrorMessage = new InternalServerError().message;

            expect(res.body.error).toEqual(expectedErrorMessage);
            expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    });

    describe("POST /api/planet", () => {
        it("should return a planet and status code CREATED", async () => {
            const planetDocument = {
                _id: "5f4459df8ee5314e8a7c0bcb",
                name: "Yavin IV",
                terrain: "jungle",
                climate: "temperated",
                updatedAt: new Date().toString(),
                filmsCount: 1,
                __v: 0,
            };

            const postData = {
                name: "Yavin IV",
                terrain: "jungle",
                climate: "temperated",
            };

            PlanetService.insertOne.mockResolvedValueOnce(planetDocument);

            const res = await request(app).post("/api/planet").send(postData);

            expect(res.body).toMatchObject(planetDocument);
            expect(res.statusCode).toEqual(StatusCodes.CREATED);
            expect(
                res.header["content-type"].includes("application/json")
            ).toBe(true);
        });

        it("should handle errors coming from service layer", async () => {
            PlanetService.insertOne.mockImplementationOnce(() => {
                throw new Error("Some Error Message");
            });

            const postData = {
                name: "Yavin IV",
                terrain: "jungle",
                climate: "temperated",
            };

            const res = await request(app).post("/api/planet").send(postData);
            const expectedError = new InternalServerError();

            expect(res.body.error).toEqual(expectedError.message);
            expect(res.statusCode).toBe(expectedError.status);
        });

        it("should handle validation errors without calling service layer", async () => {
            const mockFn = jest.fn();

            // se o serviço de inserir planeta for chamado, mockFn será chamado também
            PlanetService.insertOne.mockImplementationOnce(() => {
                mockFn();
            });

            // planet without name
            const postData = {
                terrain: "jungle",
                climate: "temperated",
            };

            const res = await request(app).post("/api/planet").send(postData);
            const expectedError = new ValidationError();

            expect(mockFn).toHaveBeenCalledTimes(0);
            expect(res.body.error).toEqual(expectedError.message);
            expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        });
    });

    describe("GET /api/planet/:id", () => {
        it("should return a planet and status code OK", async () => {
            const planetDocument = {
                _id: "5f4459df8ee5314e8a7c0bcb",
                name: "Yavin IV",
                terrain: "jungle",
                climate: "temperated",
                updatedAt: new Date().toString(),
                filmsCount: 1,
                __v: 0,
            };

            PlanetService.findById.mockResolvedValueOnce(planetDocument);

            const res = await request(app).get(
                "/api/planet/5f4459df8ee5314e8a7c0bcb"
            );

            expect(res.body).toMatchObject(planetDocument);
            expect(
                res.header["content-type"].includes("application/json")
            ).toBe(true);
            expect(res.statusCode).toEqual(StatusCodes.OK);
            expect(PlanetService.findById).toBeCalledWith(
                "5f4459df8ee5314e8a7c0bcb"
            );
        });

        it("should handle errors coming from service layer", async () => {
            PlanetService.findById.mockImplementationOnce(() => {
                throw new Error("Some Error Message");
            });

            const res = await request(app).get(
                "/api/planet/5f4459df8ee5314e8a7c0bcb"
            );
            const expectedError = new InternalServerError();

            expect(res.body.error).toEqual(expectedError.message);
            expect(res.statusCode).toBe(expectedError.status);
            expect(PlanetService.findById).toBeCalledWith(
                "5f4459df8ee5314e8a7c0bcb"
            );
        });

        it("should handle validation errors without calling service layer", async () => {
            const mockFn = jest.fn();

            // se o serviço de inserir planeta for chamado, mockFn será chamado também
            PlanetService.findById.mockImplementationOnce(() => {
                mockFn();
            });

            const res = await request(app).get("/api/planet/some_string");
            const expectedError = new ValidationError();

            expect(mockFn).toHaveBeenCalledTimes(0);
            expect(res.body.error).toEqual(expectedError.message);
            expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        });
    });

    describe("DELETE /api/planet/:id", () => {
        it("should return the id of the deleted planet with status OK", async () => {
            // nesse caso o valor retornado pelo deleteById não importa
            PlanetService.deleteById.mockResolvedValueOnce(true);

            const res = await request(app).delete(
                "/api/planet/5f4459df8ee5314e8a7c0bcb"
            );

            expect(res.body).toMatchObject({ id: "5f4459df8ee5314e8a7c0bcb" });
            expect(PlanetService.deleteById).toBeCalledWith(
                "5f4459df8ee5314e8a7c0bcb"
            );
            expect(
                res.header["content-type"].includes("application/json")
            ).toBe(true);
            expect(res.statusCode).toEqual(StatusCodes.OK);
        });

        it("should handle errors coming from service layer", async () => {
            PlanetService.deleteById.mockImplementationOnce(() => {
                throw new Error("Some Error Message");
            });

            const res = await request(app).delete(
                "/api/planet/5f4459df8ee5314e8a7c0bcb"
            );
            const expectedError = new InternalServerError();

            expect(res.body.error).toEqual(expectedError.message);
            expect(res.statusCode).toBe(expectedError.status);
            expect(PlanetService.deleteById).toBeCalledWith(
                "5f4459df8ee5314e8a7c0bcb"
            );
        });

        it("should handle validation errors without calling service layer", async () => {
            const mockFn = jest.fn();

            // se o serviço de inserir planeta for chamado, mockFn será chamado também
            PlanetService.deleteById.mockImplementationOnce(() => {
                mockFn();
            });

            const res = await request(app).delete("/api/planet/some_string");
            const expectedError = new ValidationError();

            expect(mockFn).toHaveBeenCalledTimes(0);
            expect(res.body.error).toEqual(expectedError.message);
            expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        });
    });

    describe("GET /planet/with-name/:name", () => {
        it("should return a planet and status code OK", async () => {
            const planetDocument = {
                _id: "5f4459df8ee5314e8a7c0bcb",
                name: "Yavin IV",
                terrain: "jungle",
                climate: "temperated",
                updatedAt: new Date().toString(),
                filmsCount: 1,
                __v: 0,
            };

            PlanetService.findByName.mockResolvedValueOnce(planetDocument);

            const res = await request(app).get(
                "/api/planet/with-name/Yavin IV"
            );

            expect(res.body).toMatchObject(planetDocument);
            expect(
                res.header["content-type"].includes("application/json")
            ).toBe(true);
            expect(res.statusCode).toEqual(StatusCodes.OK);
            expect(PlanetService.findByName).toBeCalledWith("Yavin IV");
        });

        it("should handle errors coming from service layer", async () => {
            PlanetService.findByName.mockImplementationOnce(() => {
                throw new Error("Some Error Message");
            });

            const res = await request(app).get(
                "/api/planet/with-name/Yavin IV"
            );
            const expectedError = new InternalServerError();

            expect(res.body.error).toEqual(expectedError.message);
            expect(res.statusCode).toBe(expectedError.status);
            expect(PlanetService.findByName).toBeCalledWith("Yavin IV");
        });
    });

    describe("GET /endpoint/doesnt/exist", () => {
        it("should return Endpoint Not Found error with status 404", async () => {
            const res = await request(app).get("/endpoint/doesnt/exist");

            const expectedError = new EndpointNotFoundError();

            expect(res.body.error).toEqual(expectedError.message);
            expect(res.statusCode).toBe(expectedError.status);
        });
    });
});
