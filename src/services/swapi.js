const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

const { SWAPI_BASE_URL: baseUrl } = process.env;

module.exports = {
    getPlanetFilmsCountByName: async (planetName) => {
        const response = await axios.get(
            `${baseUrl}/planets?search=${planetName}`
        );

        /*
            caso haja algum problema na resposta, é considerado que a informação
            não existe (null)
        */
        if (
            !response ||
            !(response.status === StatusCodes.OK) ||
            !response.data ||
            !response.data.count
        ) {
            return null;
        }

        return response.data.results[0].films.length;
    },
};
