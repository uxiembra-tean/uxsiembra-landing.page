// =============================
// LISTA DE USUARIOS (MEMORIA)
// =============================
let usuarios = [
    { nombre: "María Gonzales", rol: "admin" },
    { nombre: "Pedro Quispe", rol: "editor" },
    { nombre: "Ana Flores", rol: "tester" },
    { nombre: "Alexandre Ximenes", rol: "admin" },
    { nombre: "Lujan Carrion", rol: "editor" },
    { nombre: "Meilyn Arazaki", rol: "tester" }
];

let modoEdicion = null;   // guarda el índice del usuario a editar


// =============================
// MOSTRAR USUARIOS
// =============================
function renderUsuarios() {
    const tbody = document.getElementById("listaUsuarios");
    tbody.innerHTML = "";

    usuarios.forEach((u, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.rol}</td>
                <td>
                    <button class="btn-edit" onclick="editarUsuario(${index})">Editar</button>
                    <button class="btn-delete" onclick="eliminarUsuario(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

renderUsuarios();


// =============================
// MODAL
// =============================
const modal = document.getElementById("modal");
const inputNombre = document.getElementById("inputNombre");
const inputRol = document.getElementById("inputRol");
const modalTitulo = document.getElementById("modalTitulo");

document.getElementById("btnAgregar").addEventListener("click", () => {
    modoEdicion = null;
    modalTitulo.textContent = "Añadir usuario";
    inputNombre.value = "";
    inputRol.value = "lector";
    modal.classList.remove("hidden");
});

document.getElementById("btnCancelar").onclick = () => modal.classList.add("hidden");


// =============================
// GUARDAR / EDITAR
// =============================
document.getElementById("btnGuardar").addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    const rol = inputRol.value;

    if (!nombre) {
        alert("El nombre no puede estar vacío");
        return;
    }

    if (modoEdicion === null) {
        usuarios.push({ nombre, rol });
    } else {
        usuarios[modoEdicion] = { nombre, rol };
    }

    modal.classList.add("hidden");
    renderUsuarios();
});

// =============================
// EDITAR
// =============================
function editarUsuario(i) {
    modoEdicion = i;

    modalTitulo.textContent = "Editar usuario";
    inputNombre.value = usuarios[i].nombre;
    inputRol.value = usuarios[i].rol;

    modal.classList.remove("hidden");
}

// =============================
// ELIMINAR
// =============================
function eliminarUsuario(i) {
    if (confirm("¿Eliminar este usuario?")) {
        usuarios.splice(i, 1);
        renderUsuarios();
    }
}

// =============================
// DATOS DE AGRICULTORES
// =============================
let agricultores = [
    { nombre: "Juan Huamán", zona: "Norte", cultivo: "Maíz", riesgo: "bajo" },
    { nombre: "Rosa Mamani", zona: "Centro", cultivo: "Papa", riesgo: "medio" },
    { nombre: "Luis Quispe", zona: "Sur", cultivo: "Quinua", riesgo: "alto" },
    { nombre: "Paolo Roman", zona: "Norte", cultivo: "Zanahoria", riesgo: "bajo" },
    { nombre: "Alonso Prado", zona: "Centro", cultivo: "Papaya", riesgo: "medio" },
    { nombre: "Aime Reyes", zona: "Sur", cultivo: "Arroz", riesgo: "alto" },
];

// =============================
// RENDERIZAR LISTA DE AGRICULTORES
// =============================
function renderAgricultores() {
    const zona = document.getElementById("filtroZona").value;
    const cultivo = document.getElementById("filtroCultivo").value;
    const riesgo = document.getElementById("filtroRiesgo").value;

    const tbody = document.getElementById("listaAgricultores");
    tbody.innerHTML = "";

    agricultores
        .filter(a =>
            (zona === "" || a.zona === zona) &&
            (cultivo === "" || a.cultivo === cultivo) &&
            (riesgo === "" || a.riesgo === riesgo)
        )
        .forEach(a => {
            tbody.innerHTML += `
                <tr>
                    <td>${a.nombre}</td>
                    <td>${a.zona}</td>
                    <td>${a.cultivo}</td>
                    <td class="riesgo-${a.riesgo}">${a.riesgo.toUpperCase()}</td>
                </tr>
            `;
        });
}

renderAgricultores();

// =============================
// ACTIVAR FILTROS
// =============================
document.getElementById("filtroZona").onchange = renderAgricultores;
document.getElementById("filtroCultivo").onchange = renderAgricultores;
document.getElementById("filtroRiesgo").onchange = renderAgricultores;

// =============================
// ACTUALIZACION AUTOMATICA
// =============================
setInterval(() => {

    agricultores.forEach(a => {
        const r = Math.random();
        if (r < 0.33) a.riesgo = "bajo";
        else if (r < 0.66) a.riesgo = "medio";
        else a.riesgo = "alto";
    });

    document.getElementById("actualizacionTexto").textContent =
        "Datos actualizados: " + new Date().toLocaleTimeString();

    renderAgricultores();

}, 6000); // cada 6 segundos
