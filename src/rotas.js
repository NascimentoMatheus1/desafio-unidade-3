const { verificarUsuarioLogado } = require('./middlewares/autenticacao');
const usuarios = require('./controllers/usuarios');
const express = require('express');
const rotas = express();

rotas.post('/usuarios', usuarios.cadastrar);
rotas.post('/login', usuarios.login);

rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', usuarios.listarUsuario);

module.exports = rotas;