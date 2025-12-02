// =====================================
// DATOS DINÁMICOS: SE ROTAN AUTOMÁTICAMENTE
// =====================================

// Recomendaciones de riego (US-01.3)
const recomendaciones = [
    "10 L/m² – Humedad baja detectada",
    "14 L/m² – Día soleado con viento",
    "8 L/m² – Temperatura moderada",
    "6 L/m² – Lluvia reciente"
];

// Condiciones climáticas (US-01.4)
const climas = [
    { emoji:"⛈️", evento:"Tormenta fuerte", tiempo:"2 horas" },
    { emoji:"🌧️", evento:"Lluvia ligera", tiempo:"3 horas" },
    { emoji:"🌬️", evento:"Viento moderado", tiempo:"1 hora" },
    { emoji:"☀️", evento:"Temperatura alta", tiempo:"4 horas" }
];

// Guía práctica (US-01.5)
const pasosGuia = [
    "Revisa la humedad del suelo con una pala.",
    "Limpia el área alrededor de la planta.",
    "Aplica agua de forma uniforme alrededor del tallo.",
    "Evita formar charcos.",
    "Verifica el color del suelo después de 10 minutos."
];

// Historial inicial
const historial = [];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// =====================================
// CARGAR DATOS INICIALES
// =====================================
function cargarDatos() {

    // 1️⃣ Recomendación de riego
    const reco = randomItem(recomendaciones);
    document.getElementById("riegoRecomendado").textContent = reco;

    // 2️⃣ Clima
    const clima = randomItem(climas);
    document.getElementById("climaEmoji").textContent = clima.emoji;
    document.getElementById("climaEvento").textContent = clima.evento;
    document.getElementById("climaTiempo").textContent = clima.tiempo;

    // 3️⃣ Pasos guía
    const lista = document.getElementById("guiaPasos");
    lista.innerHTML = "";

    pasosGuia.forEach(paso => {
        const li = document.createElement("li");
        li.textContent = paso;
        lista.appendChild(li);
    });

    // 4️⃣ Historial
    renderHistorial();

    // 5️⃣ Generar gráfico
    generarGrafico();
}

cargarDatos();


// =====================================
// REGISTRAR RIEGO APLICADO
// =====================================
document.getElementById("btnAplicarRiego").addEventListener("click", () => {
    const date = new Date().toLocaleString();
    historial.unshift(`💧 Riego aplicado — ${date}`);
    renderHistorial();
    alert("Riego registrado correctamente ✓");
});


// =====================================
// REGISTRAR COMPLETADO DE GUÍA
// =====================================
document.getElementById("btnCompletarGuia").addEventListener("click", () => {
    const date = new Date().toLocaleString();
    historial.unshift(`📘 Guía de riego completada — ${date}`);
    renderHistorial();
    alert("Guía completada ✔️");
});


// =====================================
// HISTORIAL
// =====================================
function renderHistorial() {
    const ul = document.getElementById("historialRiego");
    ul.innerHTML = "";

    historial.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
}


// =====================================
// GRÁFICO DE CONSUMO (US-02.1)
// =====================================
function generarGrafico() {

    const ctx = document.getElementById("consumoChart");

    const consumos = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 5);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"],
            datasets: [{
                label: "Litros por día",
                data: consumos,
                borderColor: "#2d6a4f",
                backgroundColor: "rgba(45,106,79,0.2)",
                borderWidth: 3,
                tension: 0.35
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
