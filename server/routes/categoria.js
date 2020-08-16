const express = require('express');
let { verificaToken, verificaAdm } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');


//Mostrar todas las categorias
app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria
            });


        }); //end Find

}); //End mostrar cat





//Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDb) => {
        if (err) {
            return res.status(500), json({
                ok: false,
                err
            });
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                message: 'La categoria no existe'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDb
        });


    }); //end findId
}); //End mostrar cat by Id



//Crea una nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    //Recoger los datos del body
    let body = req.body;

    //Crear y rellenar la categoria
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    //Guardar la categoria en la DB
    categoria.save((err, categoriaDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDb
        });

    }); //end save

}); //end crear cat






//Actualiza una categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true, runValidators: true }, (err, categoriaDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                message: 'La categoria no existe'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDb
        });


    }); //end categoria update


}); //end actualizar cat







//Elimina una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdm], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada exitosamente'
        });

    }); //End remove

}); //end eliminar cat

















module.exports = app;