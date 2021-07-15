/* 
            REFERENCIAS HTML
*/

const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');






// Desarrollo o producción?
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

// Validar si el JWT es correcto


let usuario = null;
let socket = null

// Validar token del localstorage
const validarJwt = async () => {

    // Si no viene el token, será un string vacío
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();

    localStorage.setItem('token', tokenDB);

    usuario = userDB;

    // Título de la p estaña
    document.title = usuario.nombre;


    // Vliadmos el socket
    await conectarSocket();


}

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    // Usuario conectado
    socket.on('connect', () => {
        console.log('Sockets Online');
    });
    // Usuario desconectado
    socket.on('disconnect', (payload) => {
        console.log('Usuario desconectado' + payload);
    });

    // recibe todos los mensajes
    socket.on('recibir-mensajes', dibujarMensajes);

    // Listado usuarios activos
    socket.on('usuarios-activos', dibujarUsuarios);

    // Mensaje a un usuario en concreto
    socket.on('mensaje-privado', (payload) => {
        console.log('privado: ' + payload)
    });



}

// Función que muestra en el html todos los usuarios
const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';

    usuarios.forEach(({ nombre, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>

        `;
    });

    ulUsuarios.innerHTML = usersHtml;
}

// Capturar mensaje del usuario y emitirlo al servidor cuando se da enter
txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    // keyCode 13 = enter
    if(keyCode != 13) {return ;}

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if(mensaje.length == 0){return;}

    socket.emit('enviar-mensaje', {mensaje, uid});
    txtMensaje.value = '';
});


// Función que muestra en el html todos los mensajes
const dibujarMensajes = (mensajes = []) => {
    let mensajesHTML = '';

    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${nombre}:</span>
                    <span>${mensaje}</span>
                </p>
            </li>

        `;
    });

    ulMensajes.innerHTML = mensajesHTML;
}

const main = async () => {
    await validarJwt();
}

main();


