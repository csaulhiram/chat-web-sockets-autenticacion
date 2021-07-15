// Crear mensaje
class Mensaje {
    constructor(uid, nombre, mensaje) {
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}


class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }


    // lista de los úlitmos 10 mensajes
    get ultimos10() {
        this.mensajes = this.mensajes.splice(0, 10);
        return this.mensajes;
    }

    // Usuarios que están conectados
    get usuariosArr() {
        return Object.values(this.usuarios);
    }

    // Enviar mensaje
    enviarMensaje( uid, nombre, mensaje ) {
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje)
            );
    }

    // Conectar usuario
    conectarUsuario(usuario) {
        this.usuarios[usuario._id] = usuario;
    }

    // Eliminar usuario 
    desconectarUsuario(id) {
        delete this.usuarios[id];
    }

}

module.exports = ChatMensajes;