// ============================
// LOGIN UXSiembra
// ============================

// Seleccionar elementos
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const rememberCheck = document.getElementById("remember");


// ============================
// Cargar email guardado si existe
// ============================
window.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("rememberEmail");

    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheck.checked = true;
    }
});


// ============================
// Validación de email
// ============================
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


// ============================
// Simulación de autenticación
// (puedes reemplazar con tu backend real)
// ============================
function autenticar(email, password) {

    // Usuario de prueba (puedes cambiarlo)
    const usuarioDemo = {
        correo: "usuario@demo.com",
        password: "123456"
    };

    return email === usuarioDemo.correo && password === usuarioDemo.password;
}


// ============================
// Manejo del formulario
// ============================
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    // --- Validaciones ---
    if (!email || !password) {
        mostrarError("Por favor completa todos los campos.");
        return;
    }

    if (!validarEmail(email)) {
        mostrarError("El correo electrónico no es válido.");
        return;
    }

    // --- Simular autenticación ---
    if (!autenticar(email, password)) {
        mostrarError("Correo o contraseña incorrectos.");
        return;
    }

    // --- Recordarme ---
    if (rememberCheck.checked) {
        localStorage.setItem("rememberEmail", email);
    } else {
        localStorage.removeItem("rememberEmail");
    }

    // --- Login exitoso ---
    mostrarExito("¡Inicio de sesión exitoso!");

    // Redirección (cambia por tu dashboard real)
    setTimeout(() => {
        window.location.href = "menu.html";
    }, 1200);
});


// ============================
// Mostrar mensajes en pantalla
// ============================
function mostrarError(mensaje) {
    const box = document.getElementById("mensaje");
    box.textContent = mensaje;
    box.style.color = "#d9534f";
    box.style.opacity = "1";

    setTimeout(() => (box.style.opacity = "0"), 3000);
}

function mostrarExito(mensaje) {
    const box = document.getElementById("mensaje");
    box.textContent = mensaje;
    box.style.color = "#4CAF50";
    box.style.opacity = "1";

    setTimeout(() => (box.style.opacity = "0"), 3000);
}
