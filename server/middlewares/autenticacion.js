const jwt = require('jsonwebtoken');
const { json } = require('body-parser');



//Verificar token
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

}; //End verificar token



//Verifica adm rol
let verificaAdm = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }




}; //End verificarAdm


module.exports = {
    verificaToken,
    verificaAdm
}