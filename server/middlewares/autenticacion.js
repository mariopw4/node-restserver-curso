const jwt = require('jsonwebtoken');

//==================
// Verificar Token
//==================

let verificaToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

//=====================
// Verificar AdminRole
//=====================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();
}


//===========================
// Verificar Token de imagen
//===========================

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}