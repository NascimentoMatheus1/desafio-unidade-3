const categorias = require('./controllers/categorias');
const express = require('express');
const rotas = express();

rotas.get('/', categorias.listar);

module.exports = rotas;