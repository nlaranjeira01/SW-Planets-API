![build](https://github.com/nlaranjeira01/SW-Planets-API/workflows/tests/badge.svg)
[![codecov](https://codecov.io/gh/nlaranjeira01/SW-Planets-API/branch/master/graph/badge.svg)](https://codecov.io/gh/nlaranjeira01/SW-Planets-API)

# Star Wars Planets API

API dos planetas de Star Wars para o teste da B2W.

<hr>

## Executando com docker

-   É necessário ter o docker e docker-compose instalados. Para rodar a API é necessário antes criar um `.env` a partir do `.env.example`. Após isso, basta executar `docker-compose up --build`.

## Features

:heavy_check_mark: POST /api/planet &rarr; adiciona um planeta.  
:heavy_check_mark: GET /api/planet &rarr; lista todos os planetas.  
:heavy_check_mark: GET /api/planet/{id} &rarr; retorna um planeta com o id especificado.  
:heavy_check_mark: GET /api/planet/with-name/{name} &rarr; retorna um planeta pelo nome.  
:heavy_check_mark: DELETE /api/planet/{id} &rarr; deleta o planeta com o id especificado.

## Documentação

WIP
