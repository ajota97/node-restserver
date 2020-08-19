const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//Coloca todo en un objeto llamado file dentro del req (request)
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningnu archivo'
            }
        });
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo incorrecto. Los tipos permitidos son ' + tiposValidos.join(', '),
                tipo
            }
        });
    }


    //Inserto el archivos  la variable archivo con el mismo nombre en el request
    let archivo = req.files.archivo;

    //Cortamos el nombre por puntos para obtener un array con la extension separada
    let nombreCortado = archivo.name.split('.');

    //Capturamos la extension del archivo
    let extension = nombreCortado[nombreCortado.length - 1];

    //Extensiones permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //Si es menor a cero quiere decir que no lo encontró 
    if (extencionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension no válida. Las extensiones permitidas son ' + extencionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //cambiar el nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;


    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Aqui la imagen ya esta cargada, so guardamos en la DB
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }




    });

});




function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        //Actualizamos o guardamos la nueva imagen en la propiedad img de usuario
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado
            });
        });


    });
}




function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        //Actualizamos o guardamos la nueva imagen en la propiedad img de usuario
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado
            });
        });


    });

}


function borraArchivo(nombreImagen, tipo) {

    //Capturamos la ruta en donde se encuentra la imagen guardad
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    //Verificamos si existe la imagen y borramos en caso de que si exista
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}


module.exports = app;