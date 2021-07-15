const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();


// TODO: quitar  = new Socket() solo lo pusimos para tener el 
//  autocompletado
const socketController = async (socket = new Socket(), io) => {

    // Verificar token
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);


    // Si el usuario no viene, lo desconectaremos
    if (!usuario) {
        return socket.disconnect();
    }

    // Agregar al usaurio conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    // Conectar a una sala especial (mensajes privados)
    socket.join(usuario.id);// GLOBAL (socket.id), PRIVADA (usuario.id)
    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    // enviar mensaje
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {

        // Si viene el id, entonces el usuario quiere enviar un mensaje PRIVADO
        if (uid) {
            socket.to(uid).emit('mensaje-privado', { de: usuario.nombre, mensaje })
        }

        // Si NO viene el id, entonces el usuario quiere enviar un mensaje GLOBAL
        chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
        io.emit('recibir-mensajes', chatMensajes.ultimos10);

    });
}

module.exports = {
    socketController
}