'use strict'

var express = require('express');
const app = express();

var CategoryController = require('../controllers/category');
const { verificaToken, verificaAdm } = require('../middlewares/autenticacion');

//Rutas de la categoria
app.get('/categorias', CategoryController.getCategories);
app.get('/categoria/:id', verificaToken, CategoryController.getCategory);
app.post('/categoria', verificaToken, CategoryController.create);
app.put('/categoria/:id', verificaToken, CategoryController.update);
app.delete('/categoria/:id', [verificaToken, verificaAdm], CategoryController.delete);


module.exports = app;