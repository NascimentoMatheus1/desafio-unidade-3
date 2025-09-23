const usuarios = require('./controllers/usuarios');
const express = require('express');
const rotas = express();

rotas.get('/', usuarios.listar);
rotas.post('/usuarios', usuarios.cadastrar);
rotas.post('/login', usuarios.login);

module.exports = rotas;