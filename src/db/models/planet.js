const { Schema, model } = require("mongoose");

module.exports = model(
    "Planet",
    new Schema(
        {
            name: {
                type: String,
                index: true,
                required: true,
            },
            climate: String, // me baseando no terreno e clima do swapi.dev
            terrain: String,
            filmsCount: {
                type: Number,
                min: 0,
                default: null,
            },
        },
        {
            timestamps: {
                createdAt: false,
                updatedAt: true,
            },
        }
    )
);
