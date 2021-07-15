const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');


const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token')
            } else {
                resolve(token);
            }
        })

    })
}


const comprobarJWT = async (token = '') => {

    try {

        // Si el token es menor de 10
        if (token <= 10) {
            return null;
        }

        // Desencriptamos la información del payload del token
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        // Verificamos que el usuario venga  y su estado sea true
        if (usuario) {
            if(usuario.estado ){
                return usuario;
            }else{  
                return null;
            }
        } else {
            return null;
        }


    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}

