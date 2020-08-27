const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');


var controller = {

    //Obtener todos los productos
    getProducts: (req, res) => {

        let desde = Number(req.query.desde) || 0;

        Producto.find({ disponible: true })
            .skip(desde)
            .limit(5)
            .populate('categoria', 'descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, productos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                });
            });


    }, //end getProducts




    //Obtener un producto por ID
    getProduc: (req, res) => {

        let id = req.params.id;

        Producto.findById(id)
            .populate('categoria')
            .populate('usuario')
            .exec((err, producto) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!producto) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'El producto no existe'
                        }
                    });
                }

                if (!producto.disponible) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'El producto no existe'
                        }
                    });
                }

                res.json({
                    ok: true,
                    producto
                });

            });

    }, //End getProduct




    //Crear producto 
    create: (req, res) => {

        let body = req.body;

        let producto = new Producto({
            usuario: req.usuario._id,
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible,
            categoria: body.categoria
        });

        producto.save((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                producto
            });
        });

    }, //End create




    //Update producto
    update: (req, res) => {

        let id = req.params.id;
        let body = req.body;

        Producto.findById(id, (err, productoDb) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            if (!productoDb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe!'
                    }
                });
            }

            productoDb.nombre = body.nombre;
            productoDb.precioUni = body.precioUni;
            productoDb.descripcion = body.descripcion;
            productoDb.disponible = body.disponible;
            productoDb.categoria = body.categoria;

            productoDb.save((err, productoDb) => {
                if (err) {
                    return res.status(500).json({
                        ok: true,
                        err
                    });
                }

                res.json({
                    ok: true,
                    producto: productoDb
                });

            });

        });

    }, //End update



    //Eliminar producto
    delete: (req, res) => {

        let id = req.params.id;

        Producto.findById(id, (err, productoDb) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            if (!productoDb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe!'
                    }
                });
            }

            if (!productoDb.disponible) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe!'
                    }
                });
            }

            productoDb.disponible = false;

            productoDb.save((err, productoDb) => {
                if (err) {
                    return res.status(500).json({
                        ok: true,
                        err
                    });
                }

                res.json({
                    ok: true,
                    producto: productoDb,
                    message: 'Producto borrado'
                });
            });

        });

    }, //End delete




    //Buscar productos
    search: (req, res) => {

        let termino = req.params.termino;
        let regex = new RegExp(termino, 'i');

        Producto.find({ nombre: regex })
            .populate('categoria', 'nombre')
            .exec((err, productos) => {
                if (err) {
                    return res.status(500).json({
                        ok: true,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                });


            });

    }



}; //End controller

module.exports = controller;