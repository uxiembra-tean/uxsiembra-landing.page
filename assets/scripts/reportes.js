// ===============================
// 1. GRÁFICO DE CONSUMO DE AGUA
// ===============================

let aguaChart = null;

function generarDatos(rango) {
    if (rango === "dia") return Array.from({length: 24}, () => random(2, 8));
    if (rango === "semana") return Array.from({length: 7}, () => random(5, 22));
    return Array.from({length: 30}, () => random(6, 25));
}

function generarLabels(rango) {
    if (rango === "dia") return [...Array(24).keys()].map(h => h + ":00");
    if (rango === "semana") return ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
    return Array.from({length: 30}, (_,i)=>"Día "+(i+1));
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function actualizarGrafico(rango) {
    const data = generarDatos(rango);
    const labels = generarLabels(rango);

    if (aguaChart) aguaChart.destroy();

    aguaChart = new Chart(document.getElementById("aguaChart"), {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Litros",
                data,
                borderColor: "#2d6a4f",
                backgroundColor: "rgba(45,106,79,0.2)",
                borderWidth: 3,
                tension: 0.35
            }]
        }
    });
}

{
    // Función para generar datos aleatorios
function generarConsumoAleatorio(num = 7, min = 3, max = 25) {
    const data = [];
    for (let i = 0; i < num; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
}

// Cada vez que reseteas, generamos nuevos datos
let data = generarConsumoAleatorio(); 

// Calcular promedio
const promedio = data.reduce((a,b)=>a+b) / data.length;
const alerta = document.getElementById("alertaConsumo");

// Resetear estilos
alerta.style.background = "";
alerta.style.border = "";
alerta.style.color = "";

// Cambiar mensaje y color según promedio
if (promedio > 18) {
    alerta.textContent = "⚠️ Consumo alto detectado";
    alerta.style.background = "#fdecea"; 
    alerta.style.border = "1px solid #f5c2c2";
    alerta.style.color = "#b02b2b";
} else if (promedio >= 6 && promedio <= 18) {
    alerta.textContent = "✅ Consumo excelente de agua";
    alerta.style.background = "#e6f4ea"; 
    alerta.style.border = "1px solid #2ba84a";
    alerta.style.color = "#1a5e2a";
} else {
    alerta.textContent = "⚠️ Consumo demasiado bajo";
    alerta.style.background = "#fff4cc"; 
    alerta.style.border = "1px solid #f0c55a";
    alerta.style.color = "#b07d00";
}

}


// ===============================
// 2. METRICAS PRODUCTIVAS
// ===============================
function cargarMetricas() {
    document.getElementById("rendimiento").textContent = random(15, 36) + " t/ha";
    document.getElementById("costos").textContent = "$ " + random(500, 2400);
    document.getElementById("ganancia").textContent = "$ " + random(1400, 3800);
}


// ===============================
// 3. COMPARACIÓN DE CAMPAÑAS
// ===============================

const campanas = [
    { nombre: "Campaña 2023", rendimiento: 28, costo: 1800, ganancia: 2600 },
    { nombre: "Campaña 2024", rendimiento: 33, costo: 1650, ganancia: 3100 },
    { nombre: "Campaña 2025", rendimiento: 29, costo: 1700, ganancia: 2900 }
];

function cargarCampanas() {
    const c1 = document.getElementById("campana1");
    const c2 = document.getElementById("campana2");

    campanas.forEach(c => {
        const option1 = document.createElement("option");
        const option2 = document.createElement("option");
        option1.textContent = c.nombre;
        option2.textContent = c.nombre;
        c1.appendChild(option1);
        c2.appendChild(option2);
    });
}

document.getElementById("btnComparar").addEventListener("click", () => {
    const c1 = campanas.find(c => c.nombre === campana1.value);
    const c2 = campanas.find(c => c.nombre === campana2.value);

    const ul = document.getElementById("resultadoComparacion");
    ul.innerHTML = "";

    const difR = c2.rendimiento - c1.rendimiento;
    const difC = c2.costo - c1.costo;
    const difG = c2.ganancia - c1.ganancia;

    ul.innerHTML = `
        <li>Rendimiento: ${difR > 0 ? "📈 +" : "📉 "}${difR} t/ha</li>
        <li>Costos: ${difC > 0 ? "⬆️ +" : "⬇️ "}${difC}</li>
        <li>Ganancias: ${difG > 0 ? "💰 +" : "🔻 "}${difG}</li>
    `;
});


// ===============================
// 4. PROYECCIÓN DE RENDIMIENTO (US-02.5)
// ===============================

let proyeccionChart = null;

function generarProyeccion() {
    const base = random(20, 35);
    const datos = Array.from({length: 12}, (_,i)=> base + random(-2,4) + i);

    if (proyeccionChart) proyeccionChart.destroy();

    proyeccionChart = new Chart(document.getElementById("proyeccionChart"), {
        type: "line",
        data: {
            labels: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
            datasets: [{
                label: "Proyección t/ha",
                data: datos,
                borderColor: "#52796f",
                backgroundColor: "rgba(82,121,111,0.2)",
                borderWidth: 3,
                tension: 0.4
            }]
        }
    });
}


// ===============================
// 5. EXPORTACIÓN PDF / EXCEL
// ===============================
document.getElementById("btnExportPDF").addEventListener("click", () => {
    alert("📄 PDF generado correctamente (prototipo)");
});

document.getElementById("btnExportExcel").addEventListener("click", () => {
    alert("📘 Archivo Excel exportado (prototipo)");
});

// =====================================================
// 6. TRAZABILIDAD DE LOTES (US-TRZ)
// =====================================================

// Cargar registros guardados
function cargarTrazabilidad() {
    const data = JSON.parse(localStorage.getItem("trazabilidadUX")) || [];
    const tbody = document.getElementById("trzTablaBody");
    tbody.innerHTML = "";

    data.forEach(reg => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${reg.lote}</td>
            <td>${reg.fecha}</td>
            <td>${reg.tratamiento}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Guardar registro
document.getElementById("btnGuardarTrazabilidad").addEventListener("click", () => {
    const lote = document.getElementById("trzLote").value;
    const fecha = document.getElementById("trzFecha").value;
    const tratamiento = document.getElementById("trzTratamiento").value;

    if (!lote || !fecha || !tratamiento) {
        alert("⚠️ Completa todos los campos");
        return;
    }

    const nuevo = { lote, fecha, tratamiento };

    // Guardado en la nube (simulado con LocalStorage)
    const data = JSON.parse(localStorage.getItem("trazabilidadUX")) || [];
    data.push(nuevo);
    localStorage.setItem("trazabilidadUX", JSON.stringify(data));

    cargarTrazabilidad();

    // limpiar inputs
    document.getElementById("trzLote").value = "";
    document.getElementById("trzFecha").value = "";
    document.getElementById("trzTratamiento").value = "";

    alert("📦 Registro guardado correctamente");
});

// Exportar reporte (PDF prototipo)
document.getElementById("btnExportTrazabilidad").addEventListener("click", () => {
    alert("📄 Reporte de trazabilidad generado (prototipo listo para auditorías)");
});

// Ejecutar al iniciar
cargarTrazabilidad();


// ===============================
// EJECUTAR AL INICIAR
// ===============================

cargarCampanas();
cargarMetricas();
generarProyeccion();
actualizarGrafico("dia");

// Cambiar filtro
document.querySelectorAll(".filtro-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        actualizarGrafico(btn.dataset.rango);
    });
});
