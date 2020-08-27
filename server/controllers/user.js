'use strict'

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');



var controller = {


    //Obtener todos los usuarios 
    getUsers: (req, res) => {

        let desde = Number(req.query.desde) || 0;
        let limite = Number(req.query.limite) || 5;

        Usuario.find({ estado: true }, 'nombre email role estado google img ')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.countDocuments({ estado: true }, (err, conteo) => {

                    //Devolver usuarios encontrados
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    });

                });


            }); //End Find
    },


    //Registrar nuevo usuario
    save: (req, res) => {

        let body = req.body;


        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });

        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });

        });

    }, //Close save



    //Actualizar usuario
    update: (req, res) => {

        let id = req.params.id;

        //Definiendo los campos que si se pueden actualizar
        let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: 'true',
                usuario: usuarioDB
            });

        }); //End findAndUpdate

    }, //Close update



    //Eliminar user de la DB
    delete: (req, res) => {

            let id = req.params.id;

            //Verificamos que el user no este eliminado
            Usuario.findById(id).exec((err, user) => {

                if (err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }

                if (user.estado === false) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'El usuario no existe'
                        }
                    });
                } else {
                    //Cambiamos el estado a false en vez de eliminarlo totalmente de la DB
                    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, userDelete) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                err
                            });
                        };

                        if (userDelete) {
                            res.json({
                                ok: true,
                                usuario: userDelete
                            });
                        } else {
                            res.json({
                                ok: false,
                                error: { message: 'El usuario no existe' }
                            });
                        }

                    });
                }


            });



        } //End delete user





}; //Close controller


module.exports = controller;