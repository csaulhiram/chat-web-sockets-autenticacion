/* 
    Referencias HTML
*/
const miFormulario = document.querySelector('form');

/* 
    ¿Ambiente de producción o desarrollo?
*/
console.log(window.location.hostname.includes('localhost'))

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';



// Login manual
miFormulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {};

    // Valores del formulario
    for (let elementos of miFormulario.elements) {
        if (elementos.namespaceURI.length > 0) {
            formData[elementos.name] = elementos.value;
        }

    }

    // Hacemos la petición de login al servidor
    fetch(url + 'login', {
        method:'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(({msg, token}) => {
        if(msg){
            return console.log(msg);
        }

        localStorage.setItem('token',token);
        window.location = 'chat.html';
    })

});



// Usuario inicia sesión con GOOGLE
function onSignIn(googleUser) {

    /*      var profile = googleUser.getBasicProfile();
         console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
         console.log('Name: ' + profile.getName());
         console.log('Image URL: ' + profile.getImageUrl());
         console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present. */

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    fetch(url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        // desestructuramos el token de la petición a google
        .then(({ token }) => {
            // guardamos el token en el localstorage
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.log);

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}