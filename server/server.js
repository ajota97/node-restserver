require('./config/config');


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

//Configurando el cors
const cors = require('cors');
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//Llamando a las rutas user, upload, product y category
app.use(require('./routes/user'));
app.use(require('./routes/category'));
app.use(require('./routes/product'));
app.use(require('./routes/upload'));
app.use(require('./routes/imagenes'));
app.use(require('./routes/login'));


//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//Conectarse a mongoDB y usar las configuraciones de la carpeta config
mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos Online');
    });


app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});