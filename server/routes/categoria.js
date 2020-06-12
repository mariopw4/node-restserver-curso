const express = require('express');
const app = express();
const _ = require('underscore');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let Categoria = require('../models/categoria');

//===============================
// Mostrar todas las categorias
//===============================
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });
});

//===============================
// Mostrar una categoria por ID
//===============================
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe una categoría con ese id'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

//===============================
// Crear nueva categoria
//===============================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoria) => {
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
    });
});

//===============================
// Actualizar categoria
//===============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    Categoria.findByIdAndUpdate(id, body, { new: true, useFindAndModify: true, runValidators: true }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe una categoría con ese id'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

//===============================
// Eliminar categoría
//===============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Solo un administrador puede borrar categorias
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});


module.exports = app;