document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var usuario_login = document.getElementById("username").value;
    var usuario_pass = document.getElementById("password").value;

    document.getElementById("login-form").classList.add("loading");

    let mensaje = "Verificando credenciales...";
    let intervalo = setInterval(() => {
        console.log(mensaje);
        document.getElementById("status-message").textContent = mensaje; // Mostrar mensaje
        if (mensaje === "Verificando credenciales...") {
            mensaje = "Validando Identidad...";
        } else {
            clearInterval(intervalo);
        }
    }, 1200);

    setTimeout(() => {
        clearInterval(intervalo);
        fetch('../Modelo/ServidorTP.json')
            .then(response => response.json())
            .then(data => {
                var usuarioValido = data.usuario.find(user => user.usuario_login === usuario_login && user.usuario_pass === usuario_pass);

                if (usuarioValido) {

                    localStorage.setItem('usuarioActual', JSON.stringify(usuarioValido));

                    switch (usuarioValido.id_rol) {
                        case 1:
                            window.location.href = "../Vistas/admin.html";
                            break;
                        case 2:
                            window.location.href = "../Vistas/rrhh.html";
                            break;
                        case 3:
                            window.location.href = "../Vistas/prov.html";
                            break;
                        case 4:
                            window.location.href = "../Vistas/emple.html";
                            break;
                        default:
                            window.location.href = "../Vistas/menu.html";
                            break;
                    }

                } else {
                    document.getElementById("error-message").textContent = "Usuario y/o contraseñas incorrectos, Vuelva a intentarlo por favor";
                    document.getElementById("status-message").textContent = "";
                }
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
            })
            .finally(() => {
                document.getElementById("login-form").classList.remove("loading");
                console.log("proceso finalizado");
            });
    }, 3500);
});


function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (prefersDarkScheme) {
    document.body.classList.add('dark-mode');
}

document.getElementById('AlternarMO').addEventListener('click', toggleDarkMode);
