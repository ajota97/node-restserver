'use strict'

const express = require('express');
let { verificaToken, verificaAdm } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');


var controller = {

    //Mostrar todas las categorias
    getCategories: (req, res) => {

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

    }, //End getCategories


    //Mostrar categoria por ID
    getCategory: (req, res) => {

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

    }, //End getCategory



    //Crear nueva categoria
    create: (req, res) => {

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


    }, //End create



    //Actualizar categoria
    update: (req, res) => {

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

    }, //End update



    //Eliminar categoria
    delete: (req, res) => {

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

        } //End delete




}; //Close controller

module.exports = controller;