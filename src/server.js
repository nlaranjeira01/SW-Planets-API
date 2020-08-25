require("dotenv").config();
const { initConnection } = require("./db/connection");
const app = require("./app");

const { SERVER_PORT: serverPort } = process.env;

/*
    mesmo que o mongoose permita que os modelos/schemas sejam utilizados antes 
    que a conexão com o banco seja estabelecida, é bom iniciar o server apenas 
    após a conexão com o banco estar pronta
*/
initConnection(() => {
    app.listen(serverPort, () => {
        console.log(`Server running on port ${serverPort}`);
    });
});
