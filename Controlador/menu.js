document.addEventListener("DOMContentLoaded", function () {
    fetch('../Modelo/ServidorTP.json')
        .then(response => response.json())
        .then(data => {
            const tablaBody = document.getElementById('tabla-menu-body');

            // Crear un objeto para almacenar los platos y sus semanas disponibles
            const platosDisponibles = {};

            // Recorrer las semanas y agregar los platos al objeto
            data.menu_semana.forEach(semana => {
                semana.comida.forEach(idComida => {
                    if (!platosDisponibles[idComida]) {
                        platosDisponibles[idComida] = {};
                    }
                    platosDisponibles[idComida][semana.id_semana] = true;
                });
            });

            // Crear filas de la tabla
            data.comida.forEach(plato => {
                const row = document.createElement('tr');

                // Columna del nombre del plato
                const platoCell = document.createElement('td');
                platoCell.textContent = plato.nombre_comida;
                row.appendChild(platoCell);

                // Crear columnas para cada semana
                for (let i = 1; i <= 4; i++) {
                    const semanaCell = document.createElement('td');
                    if (platosDisponibles[plato.id_comida] && platosDisponibles[plato.id_comida][i]) {
                        semanaCell.textContent = 'X';
                        semanaCell.style.backgroundColor = 'yellow';
                    }
                    row.appendChild(semanaCell);
                }

                tablaBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });
});