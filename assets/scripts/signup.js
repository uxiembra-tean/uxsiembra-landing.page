// Selectores
const form = document.getElementById("signupForm");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const tipoDoc = document.getElementById("tipoDoc");
const docId = document.getElementById("docId");
const telefono = document.getElementById("telefono");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const mensajeBox = document.getElementById("mensajeSign");

// Validación email
function validarEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
}

// Mostrar mensaje
function mostrarMensaje(texto, tipo = "error") {
    mensajeBox.textContent = texto;
    mensajeBox.style.color = tipo === "error" ? "#d9534f" : "#2ba84a";
    mensajeBox.style.opacity = "1";
    setTimeout(() => mensajeBox.style.opacity = "0", 3000);
}

// Validación simple de teléfono (acepta números y +, espacios)
function validarTelefono(value) {
    const regex = /^[\d+\s()-]{6,20}$/;
    return regex.test(value);
}

// Manejo submit
form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Trim de valores
    const vNombre = nombre.value.trim();
    const vApellido = apellido.value.trim();
    const vTipoDoc = tipoDoc.value;
    const vDocId = docId.value.trim();
    const vTelefono = telefono.value.trim();
    const vEmail = email.value.trim();
    const vPassword = password.value;
    const vConfirm = confirmPassword.value;

    if (!vNombre || !vApellido || !vTipoDoc || !vDocId || !vTelefono || !vEmail || !vPassword || !vConfirm) {
        mostrarMensaje("Por favor completa todos los campos.");
        return;
    }

    if (!validarEmail(vEmail)) {
        mostrarMensaje("Correo electrónico inválido.");
        return;
    }

    if (!validarTelefono(vTelefono)) {
        mostrarMensaje("Número de teléfono inválido.");
        return;
    }

    if (vPassword.length < 6) {
        mostrarMensaje("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    if (vPassword !== vConfirm) {
        mostrarMensaje("Las contraseñas no coinciden.");
        return;
    }

    // Aquí puedes agregar lógica para enviar los datos a tu backend via fetch/ajax.
    // Por ahora simulamos registro exitoso y redirigimos a login.html

    mostrarMensaje("Registro exitoso. Redirigiendo...", "exito");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 900);
});
