const { SERVER_PORT: serverPort } = process.env;

module.exports = {
    swagger: "2.0",
    info: {
        version: "1.0.0",
        title: "SW Planets API",
        contact: {
            email: "nlaranjeira01@gmail.com",
        },
    },
    host: `localhost:${serverPort}`,
    basePath: "/api",
    schemes: ["http"],
    paths: {
        "/planet": {
            get: {
                tags: ["planet"],
                summary: "Lista todos os planetas",
                operationId: "planetFindAll",
                produces: ["application/json"],
                responses: {
                    "200": {
                        description: "OK: planetas retornados",
                    },
                    "500": {
                        description: "Internal Server Error",
                    },
                },
            },
            post: {
                tags: ["planet"],
                summary: "Adiciona um novo planeta",
                operationId: "planetInsertOne",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [
                    {
                        in: "body",
                        name: "body",
                        description: "Objeto do planeta a ser adicionado",
                        required: true,
                        schema: {
                            $ref: "#/definitions/Planet",
                        },
                    },
                ],
                responses: {
                    "201": {
                        description: "Created: planeta adicionado",
                    },
                    "422": {
                        description: "Validation Error",
                    },
                    "500": {
                        description: "Internal Server Error",
                    },
                },
            },
        },
        "/planet/{id}": {
            get: {
                tags: ["planet"],
                summary: "Retorna um planeta pelo id",
                operationId: "planetFindById",
                produces: ["application/json"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Id do planeta (ObjectID)",
                        required: true,
                        type: "string",
                    },
                ],
                responses: {
                    "200": {
                        description: "OK: planeta encontrado e retornado",
                    },
                    "404": {
                        description:
                            "Resource Not Found: planeta não encontrado",
                    },
                    "422": {
                        description: "Validation Error",
                    },
                    "500": {
                        description: "Internal Server Error",
                    },
                },
            },
            delete: {
                tags: ["planet"],
                summary: "Deleta um planeta pelo seu id",
                operationId: "planetDeleteById",
                produces: ["application/json"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Id do planeta a ser deletado",
                        required: true,
                        type: "string",
                    },
                ],
                responses: {
                    "200": {
                        description: "OK: planeta encontrado e deletado",
                    },
                    "404": {
                        description:
                            "Resource Not Found: planeta não encontrado",
                    },
                    "500": {
                        description: "Internal Server Error",
                    },
                },
            },
        },
        "/planet/with-name/{name}": {
            get: {
                tags: ["planet"],
                summary: "Retorna um planeta pelo seu nome",
                operationId: "planetFindByName",
                produces: ["application/json"],
                parameters: [
                    {
                        name: "name",
                        in: "path",
                        description: "Nome do planeta",
                        required: true,
                        type: "string",
                    },
                ],
                responses: {
                    "200": {
                        description: "OK: planeta encontrado e retornado",
                    },
                    "404": {
                        description:
                            "Resource Not Found: planeta não encontrado",
                    },
                    "500": {
                        description: "Internal Server Error",
                    },
                },
            },
        },
    },
    definitions: {
        Planet: {
            type: "object",
            required: ["name"],
            properties: {
                name: {
                    type: "string",
                    example: "Yavin IV",
                },
                terrain: {
                    type: "string",
                    example: "jungle, rainforests",
                },
                climate: {
                    type: "string",
                    example: "temperate, tropical",
                },
            },
        },
    },
};
