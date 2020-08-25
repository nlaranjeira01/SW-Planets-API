const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const { PlanetService } = require("../services");
const { planetValidator } = require("../validators");

const router = new Router();

/*
    No momento não há necessidade de criar controllers, então as rotas chamam os
    serviços diretamente
*/

router.get("/", async (req, res) => {
    try {
        const planets = await PlanetService.findAll();

        return res.status(StatusCodes.OK).json(planets);
    } catch (error) {
        return res.handleError(error);
    }
});

router.post("/", planetValidator.planetBody, async (req, res) => {
    try {
        const planetInfo = {};

        planetInfo.name = req.body.name;
        planetInfo.terrain = req.body.terrain;
        planetInfo.climate = req.body.climate;

        const planet = await PlanetService.insertOne(planetInfo);

        return res.status(StatusCodes.CREATED).json(planet);
    } catch (error) {
        return res.handleError(error);
    }
});

// Para não conflitar com a rota /:id
router.get("/with-name/:name", planetValidator.nameParam, async (req, res) => {
    try {
        const { name } = req.params;

        const planet = await PlanetService.findByName(name);

        return res.status(StatusCodes.OK).json(planet);
    } catch (error) {
        return res.handleError(error);
    }
});

router.get("/:id", planetValidator.idParam, async (req, res) => {
    try {
        const { id } = req.params;

        const planet = await PlanetService.findById(id);

        return res.status(StatusCodes.OK).json(planet);
    } catch (error) {
        return res.handleError(error);
    }
});

router.delete("/:id", planetValidator.idParam, async (req, res) => {
    try {
        const { id } = req.params;

        await PlanetService.deleteById(id);

        return res.status(StatusCodes.OK).json({
            id,
        });
    } catch (error) {
        return res.handleError(error);
    }
});

module.exports = router;
