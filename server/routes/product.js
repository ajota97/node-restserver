'use strict'

var express = require('express');
const app = express();

var ProductController = require('../controllers/product');
const { verificaToken, verificaAdm } = require('../middlewares/autenticacion');

//Rutas del producto
app.get('/productos', verificaToken, ProductController.getProducts);
app.get('/producto/:id', ProductController.getProduc);
app.post('/producto', verificaToken, ProductController.create);
app.put('/producto/:id', verificaToken, ProductController.update);
app.delete('/producto/:id', verificaToken, ProductController.delete);
app.get('/productos/buscar/:termino', verificaToken, ProductController.search);




module.exports = app;