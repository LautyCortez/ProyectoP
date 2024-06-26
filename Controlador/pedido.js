document.getElementById('agregar-pedido-btn').addEventListener('click', () => {
    console.log('Botón agregar pedido presionado');
    const pedidoForm = document.getElementById('pedido-form');
    pedidoForm.style.display = 'block';
    const idSemana = document.getElementById('semanas-checkboxes');
    const idComida = document.getElementById('id_comida');
    idSemana.style.display = 'inline-block';
    idComida.style.display = 'inline-block';
    console.log('Selects mostrados correctamente');
    document.querySelector('.modificar-pedido-btn').style.display = 'none';
});
let datos = {
    rol: [],
    usuario: [],
    comida: [],
    guarnicion: [],
    menuSemana: [],
    pedidoMenuProximo: [],
    pedidoMenuActual: [],
};

fetch('../Modelo/ServidorTP.json')
    .then(response => response.json())
    .then(data => {
        datos.rol = data.rol;
        datos.usuario = data.usuario;
        datos.comida = data.comida;
        datos.guarnicion = data.guarnicion;
        datos.menuSemana = data.menuSemana;
        datos.pedidoMenuProximo = data.pedidoMenuProximo;
        datos.pedidoMenuActual = data.pedidoMenuActual;

        // Ejecutar las funciones que dependen de los datos cargados
        renderPedidoList();
        renderPlatos();
    });

// Función para renderizar la lista de pedidos
function renderPedidoList() {
    const pedidoListUl = document.getElementById('pedido-list-ul');
    pedidoListUl.innerHTML = '';
    datos.pedidoMenuActual.forEach((pedido) => {
        const li = document.createElement('li');
        li.textContent = `Pedido ${pedido.id_usuario} - ${pedido.dia[0].id_comida} - ${pedido.dia[0].id_guarnicion}`;
        pedidoListUl.appendChild(li);
    });
}

// Función para renderizar las opciones de platos
function renderPlatos() {
    const idComidaSelect = document.getElementById('id_comida');
    idComidaSelect.innerHTML = '';
    datos.comida.forEach((comida) => {
        const option = document.createElement('option');
        option.value = comida.id_comida;
        option.textContent = comida.nombre_comida;
        idComidaSelect.appendChild(option);
    });
}

// Función para agregar un nuevo pedido
function agregarPedido() {
    const checkboxes = document.querySelectorAll('input[name="semanas"]:checked');
    const semanasSeleccionadas = [];
    checkboxes.forEach((checkbox) => {
        semanasSeleccionadas.push(checkbox.value);
    });
    const idComida = document.getElementById('id_comida').value;

    if (semanasSeleccionadas.length === 0 || !idComida) {
        alert('Por favor seleccione una semana y un plato.');
        return;
    }

    semanasSeleccionadas.forEach(semana => {
        const nuevoPedido = {
            id_usuario: 1,
            id_semana: semana,
            dia: [
                {
                    id_comida: [idComida],
                    id_guarnicion: [1],
                },
            ],
        };
        datos.pedidoMenuActual.push(nuevoPedido);
    });

    renderPedidoList(); // Actualizar la lista de pedidos
    document.getElementById('pedido-form').style.display = 'none';
}

// Función para modificar un pedido existente
function modificarPedido(idPedido) {
    const pedido = datos.pedidoMenuActual.find((pedido) => pedido.id_usuario === idPedido);
    if (pedido) {
        // Precargar los datos del pedido en el formulario de modificación
        document.querySelectorAll('input[name="semanas"]').forEach((checkbox) => {
            checkbox.checked = pedido.id_semana.includes(checkbox.value);
        });
        document.getElementById('id_comida').value = pedido.dia[0].id_comida;
        // Mostrar el formulario de modificación
        document.getElementById('pedido-form').style.display = 'block';
        document.querySelector('.modificar-pedido-btn').style.display = 'block';
    }
}

// Función para eliminar un pedido
function eliminarPedido(idPedido) {
    const index = datos.pedidoMenuActual.findIndex((pedido) => pedido.id_usuario === idPedido);
    if (index !== -1) {
        datos.pedidoMenuActual.splice(index, 1);
        renderPedidoList();
    }
}

// Función para filtrar la lista de pedidos por semana
function filtrarPedidos() {
    const searchInput = document.getElementById('search-input');
    const idSemana = searchInput.value;
    const pedidoListUl = document.getElementById('pedido-list-ul');
    pedidoListUl.innerHTML = '';
    if (idSemana) {
        const pedidosFiltrados = datos.pedidoMenuActual.filter((pedido) => pedido.id_semana === parseInt(idSemana));
        pedidosFiltrados.forEach((pedido) => {
            const li = document.createElement('li');
            li.textContent = `Pedido ${pedido.id_usuario} - ${pedido.dia[0].id_comida} - ${pedido.dia[0].id_guarnicion}`;
            pedidoListUl.appendChild(li);
        });
    } else {
        renderPedidoList();
    }
}

// Event listeners
document.getElementById('agregar-pedido-btn').addEventListener('click', () => {
    document.getElementById('pedido-form').style.display = 'block';
});

document.getElementById('pedido-form-form').addEventListener('submit', (e) => {
    e.preventDefault();
    agregarPedido(); // Llamar a la función agregarPedido sin parámetros
});

document.querySelectorAll('.modificar-pedido-btn').forEach((button) => {
    button.addEventListener('click', (e) => {
        const idPedido = parseInt(e.target.getAttribute('data-id'));
        modificarPedido(idPedido);
    });
});

document.getElementById('search-input').addEventListener('input', filtrarPedidos);
