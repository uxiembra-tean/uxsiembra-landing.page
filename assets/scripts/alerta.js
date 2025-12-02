// =====================
// DATOS DINÁMICOS
// =====================
// OPCIONES DE ALERTAS TEMPRANAS
const alertasTempranas = [
    {
        emoji: "🪲",
        plaga: "Gorgojo de los Andes",
        nivel: "Alto",
        recomendacion: "Aplicar control biológico en las próximas 24 horas."
    },
    {
        emoji: "🦗",
        plaga: "Chapulín verde",
        nivel: "Moderado",
        recomendacion: "Monitorear hojas cada 8 horas."
    },
    {
        emoji: "🐛",
        plaga: "Oruga cortadora",
        nivel: "Crítico",
        recomendacion: "Aplicar insecticida orgánico inmediatamente."
    }
];

// OPCIONES DE RIEGO
const riegos = [
    { litros: "10 L/m²" },
    { litros: "12 L/m²" },
    { litros: "8 L/m²" },
    { litros: "6 L/m²" },
    { litros: "15 L/m²" },
    { litros: "7 L/m²" },
    { litros: "9 L/m²" },
];

// OPCIONES DE ALERTAS CLIMÁTICAS
const alertasClima = [
    { emoji: "⛈️", evento: "Tormenta fuerte", tiempo: "2 horas" },
    { emoji: "🌧️", evento: "Lluvia moderada", tiempo: "4 horas" },
    { emoji: "🌬️", evento: "Vientos fuertes", tiempo: "1 hora" },
    { emoji: "🔥", evento: "Temperatura alta", tiempo: "3 horas" }
];

// ===========================================
// FUNCIÓN UTILITARIA: OBTENER ALEATORIO
// ===========================================
function randomItem(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

// ===========================================
// PINTAR DATOS DINÁMICOS EN PANTALLA
// ===========================================
function cargarDatosAleatorios() {

    // 1️⃣ ALERTA TEMPRANA
    const alerta = randomItem(alertasTempranas);
    document.getElementById("alertEmoji").textContent = alerta.emoji;
    document.getElementById("alertPlaga").textContent = alerta.plaga;
    document.getElementById("alertNivel").textContent = alerta.nivel;
    document.getElementById("alertReco").textContent = alerta.recomendacion;

    // 2️⃣ RIEGO
    const riego = randomItem(riegos);
    document.getElementById("riegoLitros").textContent = riego.litros;

    // 3️⃣ CLIMA
    const clima = randomItem(alertasClima);
    document.getElementById("climaEmoji").textContent = clima.emoji;
    document.getElementById("climaEvento").textContent = clima.evento;
    document.getElementById("climaTiempo").textContent = clima.tiempo;

    // 4️⃣ HISTORIAL RANDOMIZADO (3 items)
    const history = document.getElementById("alertHistory");
    history.innerHTML = ""; 

    const historialBase = [
        "🐛 Riesgo de plaga",
        "💧 Humedad baja",
        "🌡️ Temperatura inusual",
        "⛈️ Lluvia fuerte",
        "🌬️ Viento elevado"
    ];

    const historialCultivo =[
        "🍅 Tomate",
        "🥔 Papa",
        "🥬 Lechuga",
        "🌽 Maiz",
        "🥕 Zanahoria",
        "🌾 Trigo",
        "🍠 Camote"
    ];
    
    for (let i = 0; i < 3; i++) {
        const entry = document.createElement("li");
        const clima = randomItem(historialBase);
        const texto = randomItem(historialCultivo);
        const date = new Date(Date.now() - i * 86400000).toLocaleDateString();
        entry.textContent = `${clima} — ${texto} — ${date}`;
        history.appendChild(entry);
    }
}

// Ejecutar al abrir la página
cargarDatosAleatorios();

// ===========================================
// FUNCIÓN: RIEGO APLICADO
// ===========================================
document.getElementById("btnAplicarRiego").addEventListener("click", () => {

    const history = document.getElementById("alertHistory");
    const newEntry = document.createElement("li");

    const date = new Date().toLocaleDateString();
    newEntry.textContent = `💧 Riego aplicado — ${date}`;

    history.prepend(newEntry);

    alert("Riego registrado correctamente ✓");
});
