const mongoose = require("mongoose");

jest.mock("./swapi", () => {
    return { getPlanetFilmsCountByName: jest.fn() };
});

const { Planet } = require("../db/models");
const { ResourceNotFoundError } = require("../errors");
const SWAPIService = require("./swapi");
const PlanetService = require("./planet");

describe("Planet service", () => {
    // cria a conexão e mocka o swapi com um valor padrão
    beforeAll(async () => {
        await mongoose.connect(
            global.__MONGO_URI__,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            },
            (err) => {
                if (err) {
                    console.error(err);
                }
            }
        );
    });

    // deletar todos os planetas antes de cada teste
    beforeEach(async () => {
        await Planet.deleteMany({});
    });

    // ao fechar a conexão com o mongodb o jest pode completar a execução
    afterAll(async (done) => {
        await mongoose.connection.close();
        done();
    });

    it("should return all the planets in the database", async () => {
        const dummyPlanet = await Planet.create({
            name: "Yavin IV",
            climate: "temperate, tropical",
            terrain: "jungle, rainforests",
            filmsCount: 1,
        });

        const planets = await PlanetService.findAll();

        expect(planets.length).toEqual(1);
        expect(planets[0].toObject({ getters: true })).toMatchObject(
            dummyPlanet.toObject({ getters: true })
        );
    });

    it("should return the correct planet by id", async () => {
        const dummyPlanet = await Planet.create({
            name: "Yavin IV",
            climate: "temperate, tropical",
            terrain: "jungle, rainforests",
            filmsCount: 1,
        });
        const planet = await PlanetService.findById(dummyPlanet._id);

        expect(planet.toObject({ getters: true })).toMatchObject(
            dummyPlanet.toObject({ getters: true })
        );
    });

    it("should return the correct planet by name", async () => {
        const dummyPlanet = await Planet.create({
            name: "Yavin IV",
            climate: "temperate, tropical",
            terrain: "jungle, rainforests",
            filmsCount: 1,
        });

        const planet = await PlanetService.findByName(dummyPlanet.name);

        expect(planet.toObject({ getters: true })).toMatchObject(
            dummyPlanet.toObject({ getters: true })
        );
    });

    it("should delete a planet by id", async () => {
        const dummyPlanet = await Planet.create({
            name: "Yavin IV",
            climate: "temperate, tropical",
            terrain: "jungle, rainforests",
            filmsCount: 1,
        });

        const deleted = await PlanetService.deleteOne(dummyPlanet._id);

        expect(deleted).toBe(true);
    });

    it("should create one planet", async () => {
        const dummyPlanetInfo = {
            name: "Yavin IV",
            climate: "temperate, tropical",
            terrain: "jungle, rainforests",
        };

        SWAPIService.getPlanetFilmsCountByName.mockResolvedValueOnce(1);

        const planet = await PlanetService.insertOne(dummyPlanetInfo);

        expect(planet.name).toMatch(dummyPlanetInfo.name);
        expect(planet.filmsCount).toBe(1);
    });

    it("should fail to create a planet without a name", async () => {
        const dummyPlanetInfo = {
            climate: "temperate, tropical",
            terrain: "jungle, rainforests",
        };

        SWAPIService.getPlanetFilmsCountByName.mockResolvedValueOnce(1);

        expect(PlanetService.insertOne(dummyPlanetInfo)).rejects.toThrowError(
            mongoose.Error.ValidationError
        );
    });

    it("should fail to delete a planet that doesn't exist", async () => {
        const dummyId = "5f4459df8ee5314e8a7c0bcb";

        await expect(PlanetService.deleteOne(dummyId)).rejects.toThrowError(
            ResourceNotFoundError
        );
    });

    it("should fail to find a planet that doesn't exist by name", async () => {
        const dummyName = "Yavin IV";

        await expect(PlanetService.findByName(dummyName)).rejects.toThrowError(
            ResourceNotFoundError
        );
    });

    it("should fail to find a planet that doesn't exist by id", async () => {
        const dummyId = "5f4459df8ee5314e8a7c0bcb";

        await expect(PlanetService.findById(dummyId)).rejects.toThrowError(
            ResourceNotFoundError
        );
    });

    it("should update filmsCount if planet found by id was not recently updated", async () => {
        const oldDate = new Date();
        oldDate.setDate(
            oldDate.getDate() - +process.env.FILMS_COUNT_EXPIRE_DAYS
        );

        let dummyPlanet = await Planet.create({
            name: "Yavin IV",
            climate: "temperate, tropical",
            terrain: "jungle, rainforests",
            filmsCount: 1,
        });

        // atualiza o updatedAt para uma data antiga
        dummyPlanet = await Planet.findByIdAndUpdate(
            dummyPlanet._id,
            { updatedAt: oldDate },
            { timestamps: false }
        );

        SWAPIService.getPlanetFilmsCountByName.mockResolvedValueOnce(2);

        const planet = await PlanetService.findById(dummyPlanet._id);

        expect(planet.filmsCount).toBe(2);
    });

    it("should update filmsCount if planet found by name was not recently updated", async () => {
        const oldDate = new Date();
        oldDate.setDate(
            oldDate.getDate() - +process.env.FILMS_COUNT_EXPIRE_DAYS
        );

        let dummyPlanet = await Planet.create({
            name: "Yavin IV",
            climate: "temperate, tropical",
            terrain: "jungle, rainforests",
            filmsCount: 1,
        });

        // atualiza o updatedAt para uma data antiga
        dummyPlanet = await Planet.findByIdAndUpdate(
            dummyPlanet._id,
            { updatedAt: oldDate },
            { timestamps: false }
        );

        SWAPIService.getPlanetFilmsCountByName.mockResolvedValueOnce(2);

        const planet = await PlanetService.findByName(dummyPlanet.name);

        expect(planet.filmsCount).toBe(2);
    });

    it("should update filmsCount for all planets that were not recently updated", async () => {
        const oldDate = new Date();
        oldDate.setDate(
            oldDate.getDate() - +process.env.FILMS_COUNT_EXPIRE_DAYS
        );

        const dummyPlanet = await Planet.create({
            name: "Yavin IV",
            climate: "temperate, tropical",
            terrain: "jungle, rainforests",
            filmsCount: 1,
        });

        // atualiza o updatedAt para uma data antiga
        await Planet.findByIdAndUpdate(
            dummyPlanet._id,
            { updatedAt: oldDate },
            { timestamps: false }
        );

        SWAPIService.getPlanetFilmsCountByName.mockResolvedValueOnce(2);

        const planets = await PlanetService.findAll();

        expect(planets[0].filmsCount).toBe(2);
    });
});
