const { verificarUsuarioLogado } = require('./middlewares/autenticacao');
const usuarios = require('./controllers/usuarios');
const categorias = require('./controllers/categorias');
const transacoes = require('./controllers/transacoes');
const express = require('express');
const rotas = express();

rotas.post('/usuarios', usuarios.cadastrar);
rotas.post('/login', usuarios.login);

rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', usuarios.listar);
rotas.put('/usuario', usuarios.atualizar);
rotas.get('/categorias', categorias.listar);
rotas.get('/transacao', transacoes.listar);
rotas.post('/transacao', transacoes.cadastrar);
rotas.put('/transacao/:id', transacoes.atualizar);
rotas.delete('/transacao/:id', transacoes.deletar);
rotas.get('/transacao/extrato', transacoes.extrato);
rotas.get('/transacao/:id', transacoes.detalhar);

module.exports = rotas;