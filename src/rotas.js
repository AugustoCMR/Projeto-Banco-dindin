const express = require('express');
const rotas = express.Router()
const { validaExisteCategoriaParams, validaExisteCategoriaBody, validaCategoriaPertenceAoUsuario, validaDescricao, validaExisteTransacaoParaCategoria, validaSeExisteDescricao, validaCategoriaBodyPertenceAoUsuario } = require('./intermediarios/validacoesCategorias')
const { listarCategorias, detalharCategoria, cadastrarCategoria, atualizarCategoria, deletarCategoria } = require('./controladores/categorias');
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario } = require('./controladores/usuarios');
const autenticaUsuario = require("./intermediarios/autenticacao");
const { validaEmail, validaPropriedadesUsuario, validaLogin } = require('./intermediarios/validacoesUsuarios');
const { deletarTransacao, listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, extratoTransacao } = require('./controladores/transacoes');
const { validaIdTransacao, validaSeCamposForamDigitados, validaTipo } = require('./intermediarios/validaTransacoes');


rotas.post("/usuario", validaPropriedadesUsuario, validaEmail, cadastrarUsuario);
rotas.post("/login", validaLogin, login);

rotas.use(autenticaUsuario);

rotas.get("/usuario", detalharUsuario);
rotas.put("/usuario", validaPropriedadesUsuario, validaEmail, atualizarUsuario);

rotas.get('/categoria', listarCategorias);
rotas.get('/categoria/:id', validaExisteCategoriaParams, validaCategoriaPertenceAoUsuario, detalharCategoria);
rotas.post('/categoria', validaDescricao, validaSeExisteDescricao, cadastrarCategoria);
rotas.put('/categoria/:id', validaExisteCategoriaParams, validaDescricao, validaCategoriaPertenceAoUsuario, validaSeExisteDescricao, atualizarCategoria);
rotas.delete('/categoria/:id', validaExisteCategoriaParams, validaCategoriaPertenceAoUsuario, validaExisteTransacaoParaCategoria, deletarCategoria);

rotas.delete("/transacao/:id", validaIdTransacao, deletarTransacao);
rotas.get("/transacao", listarTransacoes);
rotas.get('/transacao/extrato', extratoTransacao);
rotas.get("/transacao/:id", validaIdTransacao, detalharTransacao);
rotas.post('/transacao', validaExisteCategoriaBody, validaCategoriaBodyPertenceAoUsuario, validaSeCamposForamDigitados, validaTipo, cadastrarTransacao);
rotas.put('/transacao/:id', validaIdTransacao, validaSeCamposForamDigitados, validaExisteCategoriaBody, validaCategoriaBodyPertenceAoUsuario, validaTipo, atualizarTransacao);


module.exports = rotas