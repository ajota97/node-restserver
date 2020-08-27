'use strict'

var express = require('express');
const app = express();

var UserController = require('../controllers/user');
const { verificaToken, verificaAdm } = require('../middlewares/autenticacion');

//Rutas del usuario
app.get('/usuarios', verificaToken, UserController.getUsers);
app.post('/register', [verificaToken, verificaAdm], UserController.save);
app.put('/usuario/:id', [verificaToken, verificaAdm], UserController.update);
app.delete('/usuario/:id', [verificaToken, verificaAdm], UserController.delete);



module.exports = app;