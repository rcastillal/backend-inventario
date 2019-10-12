var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// ==============================================================
// Obtener todos los Usuarios.
// ==============================================================
app.get('/', (req, res) => {

    Usuario.find({}, 'nombre apellidos email img role')

    .exec(
        (err, usuarios) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario ',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });

        });

});




// ================================================================
// Crear un nuevo Usuario
// ================================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role

    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario ',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });

});


// ================================================================
// Actualizar un Usuario
// ================================================================
app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario ",
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario con ID: " + id + " no existe",
                errors: { message: "No existe un usuario con ese ID" }
            });
        }

        usuario.nombre = body.nombre;
        usuario.apellidos = body.apellidos;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario ",
                    errors: err
                });
            }

            usuarioGuardado.password = ":)";

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// ================================================================
// Borrar un usuario dado
// ================================================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar usuario ",
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario con ID: " + id + " no existe",
                errors: { message: "No existe un usuario con ese ID" }
            });
        }

        usuarioBorrado.password = ":)";

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;