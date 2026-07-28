// 1. Objeto dinámico de capacidad con 15 lugares por mesa
const mesasData = {
    "Mesa 1": { capacidadTotal: 15, ocupados: 0, moderador: "Modera Mesa 1" },
    "Mesa 2": { capacidadTotal: 15, ocupados: 0, moderador: "Modera Mesa 2" },
    "Mesa 3": { capacidadTotal: 15, ocupados: 0, moderador: "Modera Mesa 3" },
    "Mesa 4": { capacidadTotal: 15, ocupados: 0, moderador: "Modera Mesa 4" }
};

let contadorFolio = 0;

document.addEventListener("DOMContentLoaded", () => {
    renderizarAsientos();
    actualizarInterfazLugares();
    inicializarSeleccionMesas();
    inicializarFormulario();
});

// Genera los 15 puntos (sillas) distribuidos arriba y abajo de la mesa
function renderizarAsientos() {
    const mapaIds = {
        "Mesa 1": "mesa1",
        "Mesa 2": "mesa2",
        "Mesa 3": "mesa3",
        "Mesa 4": "mesa4"
    };

    for (const [nombreMesa, info] of Object.entries(mesasData)) {
        const idSuffix = mapaIds[nombreMesa];
        const topContainer = document.getElementById(`sillas-top-${idSuffix}`);
        const bottomContainer = document.getElementById(`sillas-bottom-${idSuffix}`);

        if (topContainer && bottomContainer) {
            topContainer.innerHTML = "";
            bottomContainer.innerHTML = "";

            // Distribuir 8 sillas arriba y 7 sillas abajo (Total: 15)
            for (let i = 0; i < info.capacidadTotal; i++) {
                const silla = document.createElement("span");
                silla.classList.add("silla-dot");
                
                // Determinar si está disponible u ocupada
                if (i < info.ocupados) {
                    silla.classList.add("ocupado");
                } else {
                    silla.classList.add("disponible");
                }

                if (i < 8) {
                    topContainer.appendChild(silla);
                } else {
                    bottomContainer.appendChild(silla);
                }
            }
        }
    }
}

// Actualiza números y barras de progreso
function actualizarInterfazLugares() {
    const mapaIds = {
        "Mesa 1": "mesa1",
        "Mesa 2": "mesa2",
        "Mesa 3": "mesa3",
        "Mesa 4": "mesa4"
    };

    for (const [nombreMesa, info] of Object.entries(mesasData)) {
        const idSuffix = mapaIds[nombreMesa];
        const disponibles = info.capacidadTotal - info.ocupados;
        const porcentaje = (disponibles / info.capacidadTotal) * 100;

        const txtElemento = document.getElementById(`txt-${idSuffix}`);
        const barElemento = document.getElementById(`bar-${idSuffix}`);

        if (txtElemento && barElemento) {
            txtElemento.textContent = `${disponibles} / ${info.capacidadTotal} disponibles`;
            barElemento.style.width = `${porcentaje}%`;

            if (disponibles <= 3) {
                barElemento.style.backgroundColor = "#ef4444"; // Rojo
            } else if (disponibles <= 7) {
                barElemento.style.backgroundColor = "#f59e0b"; // Naranja
            } else {
                barElemento.style.backgroundColor = "#22c55e"; // Verde
            }
        }
    }

    // Volver a renderizar el estado de los asientos
    renderizarAsientos();
}

// Manejo de la selección de mesas
function inicializarSeleccionMesas() {
    const tarjetasMesa = document.querySelectorAll(".mesa-card");
    const campoMesaOculto = document.getElementById("mesaSeleccionada");

    tarjetasMesa.forEach(card => {
        card.addEventListener("click", () => {
            const nombreMesa = card.dataset.mesa;
            const info = mesasData[nombreMesa];

            if (info.capacidadTotal - info.ocupados <= 0) {
                alert("Esta mesa ya no cuenta con lugares disponibles.");
                return;
            }

            tarjetasMesa.forEach(m => m.classList.remove("seleccionada"));
            card.classList.add("seleccionada");
            campoMesaOculto.value = nombreMesa;
        });
    });
}

// Procesa el registro y guarda en localStorage
function inicializarFormulario() {
    const btnRegistrar = document.getElementById("btnRegistrar");
    const modalElemento = new bootstrap.Modal(document.getElementById('modalConfirmacion'));

    btnRegistrar.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        const cargo = document.getElementById("cargo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const mesaSeleccionada = document.getElementById("mesaSeleccionada").value;

        if (!nombre || !cargo || !telefono || !mesaSeleccionada) {
            alert("Por favor complete todos los campos y seleccione una mesa.");
            return;
        }

        // Registrar un lugar en la mesa
        if (mesasData[mesaSeleccionada]) {
            mesasData[mesaSeleccionada].ocupados++;
            actualizarInterfazLugares();
        }

        // Generar folio
        contadorFolio++;
        const folioFormateado = `CZM-${String(contadorFolio).padStart(5, '0')}`;

        // ----------------------------------------------------
        // NUEVO: Guardar el registro en el almacenamiento local
        // ----------------------------------------------------
        const nuevoRegistro = {
            folio: folioFormateado,
            nombre: nombre,
            cargo: cargo,
            telefono: telefono,
            mesa: mesaSeleccionada,
            fecha: new Date().toLocaleString()
        };

        // Obtener lista actual o crear una nueva
        let registrosGuardados = JSON.parse(localStorage.getItem("asistentes_czm")) || [];
        registrosGuardados.push(nuevoRegistro);
        
        // Guardar array actualizado
        localStorage.setItem("asistentes_czm", JSON.stringify(registrosGuardados));
        // ----------------------------------------------------

        // Mostrar datos en el Modal
        document.getElementById("modalNombre").textContent = nombre;
        document.getElementById("modalCargo").textContent = cargo;
        document.getElementById("modalMesa").textContent = mesaSeleccionada;
        document.getElementById("modalFolio").textContent = folioFormateado;

        modalElemento.show();

        // Limpiar inputs
        document.getElementById("nombre").value = "";
        document.getElementById("cargo").value = "";
        document.getElementById("telefono").value = "";
        document.getElementById("mesaSeleccionada").value = "";
        
        document.querySelectorAll(".mesa-card").forEach(m => m.classList.remove("seleccionada"));
    });
    
 // Agrega esto al FINAL de js/registro.js
function accesoAdmin() {
    const claveCorrecta = "1234"; // Cambia "1234" por tu contraseña deseada
    const claveIngresada = prompt("Ingrese la clave de acceso de Administrador:");

    if (claveIngresada === null) {
        return; // El usuario le dio a "Cancelar"
    }

    if (claveIngresada.trim() === claveCorrecta) {
        window.location.href = "admin.html";
    } else {
        alert("Contraseña incorrecta. Acceso denegado.");
    }
}
}