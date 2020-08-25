const { Router } = require("express");
const planetRouter = require("./planet");

const router = new Router();

router.use("/planet", planetRouter);

module.exports = router;
