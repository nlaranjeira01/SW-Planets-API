const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

const SWAPIService = require("./swapi");

jest.mock("axios");

describe("SWAPI Service", () => {
    it("should return the planet's film appearances count", async () => {
        const resp = {
            status: StatusCodes.OK,
            data: {
                count: 1,
                results: [
                    {
                        films: ["http://swapi.dev/api/films/1/"],
                    },
                ],
            },
        };

        axios.get.mockResolvedValueOnce(resp);

        expect(
            await SWAPIService.getPlanetFilmsCountByName("Yavin IV")
        ).toEqual(1);
    });

    it("should return null if planet not found", async () => {
        const resp = {
            status: StatusCodes.OK,
            data: {
                count: 0,
            },
        };

        axios.get.mockResolvedValueOnce(resp);

        expect(
            await SWAPIService.getPlanetFilmsCountByName("Yavin IV")
        ).toBeNull();
    });

    it("should return null if status code different from OK", async () => {
        const resp = {
            status: StatusCodes.NOT_FOUND,
        };

        axios.get.mockResolvedValueOnce(resp);

        expect(
            await SWAPIService.getPlanetFilmsCountByName("Yavin IV")
        ).toBeNull();
    });
});
