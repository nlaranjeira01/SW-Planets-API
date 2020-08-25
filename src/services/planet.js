const { Planet } = require("../db/models");
const SWAPIService = require("./swapi");
const { ResourceNotFoundError } = require("../errors");
const { isDateInRange } = require("../helpers/is-date-in-range");

const { FILMS_COUNT_EXPIRE_DAYS: filmsCountExpireDays } = process.env;

// verifica se o valor de filmsCount deve ser atualizado
// o valor de filmsCount é atualizado com informações de swapi.dev
// dependendo da quantidade de dias de FILMS_COUNT_EXPIRE_DAYS
async function checkUpdateFilmsCount(planet) {
    if (!isDateInRange(planet.updatedAt, filmsCountExpireDays)) {
        planet.filmsCount = await SWAPIService.getPlanetFilmsCountByName(
            planet.name
        );
        planet.updatedAt = new Date(); // assim forçamos que o updatedAt seja atualizado mesmo se filmsCount não mudar
        return planet.save();
    }

    return planet;
}

async function findAll() {
    const planets = await Planet.find({});

    return Promise.all(planets.map(checkUpdateFilmsCount));
}

async function findById(id) {
    const planet = await Planet.findById(id);

    if (!planet) {
        throw new ResourceNotFoundError("Planet not found");
    }

    return checkUpdateFilmsCount(planet);
}

async function findByName(name) {
    const planet = await Planet.findOne({ name });

    if (!planet) {
        throw new ResourceNotFoundError("Planet not found");
    }

    return checkUpdateFilmsCount(planet);
}

async function insertOne({ name, climate, terrain }) {
    const planetInfo = {
        name,
        climate,
        terrain,
        filmsCount: await SWAPIService.getPlanetFilmsCountByName(name),
    };

    return Planet.create(planetInfo);
}

async function deleteOne(id) {
    const result = await Planet.deleteOne({ _id: id });

    if (result.n === 0) {
        throw new ResourceNotFoundError("Planet not found");
    }

    return true;
}

module.exports = {
    findAll,
    findById,
    findByName,
    insertOne,
    deleteOne,
};
