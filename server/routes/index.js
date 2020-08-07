const express = require('express');
const app = express();

//Rutas del usuario
app.use(require('./usuario'));
app.use(require('./login'));



module.exports = app;