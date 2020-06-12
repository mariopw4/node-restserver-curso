const express = require('express');
const app = express();

let { verificaToken } = require('../middlewares/autenticacion');

let Producto = require('../models/producto');

//==============================
// Obtener todos los productos
//==============================
app.get('/productos', (req, res) => {
    //populate
    //paginado
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});


//==============================
// Obtener un producto por id
//==============================
app.get('/productos/:id', (req, res) => {
    //populate
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No existe un producto con ese id'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });
        });
});


//==============================
// Crear un producto
//==============================
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria
    let usuario = req.usuario;
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuario._id
    });

    producto.save((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
});


//==============================
// Actualizar un producto
//==============================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: true }, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe producto con ese ID'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
});


//==============================
// Borrar un producto
//==============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, useFindAndModify: true }, (err, producto) => {
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
                    message: 'No existe producto con ese ID'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
});


module.exports = app;