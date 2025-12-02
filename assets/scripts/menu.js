// ============================
// Dashboard JS - UXiembra (demo)
// ============================

/*
 Features implemented:
 - Simula alertas automáticas y las muestra en Alerts panel
 - Guarda historial de alertas en localStorage
 - Gráfico de consumo de agua (Chart.js) con rangos
 - Recomendación de riego basada en humedad simulada
 - Botón "Aplicado" que guarda fecha/estado en localStorage
 - Actividad reciente simulada
*/

// ---------- Helpers ----------
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(ts = Date.now()) {
  const d = new Date(ts);
  return d.toLocaleString();
}

// ---------- Storage keys ----------
const ALERTS_KEY = "ux_alerts_history_v1";
const IRRIGATION_KEY = "ux_irrigation_applied_v1";

// ---------- Elements ----------
const alertsListEl = $("#alertsList");
const alertsHistoryEl = $("#alertsHistory");
const viewAllAlertsBtn = $("#viewAllAlerts");
const alertsModal = $("#alertsModal");
const closeAlertsModal = $("#closeAlertsModal");
const btnSimulateAlert = $("#btnSimulateAlert");

const humidityValueEl = $("#humidityValue");
const pestsValueEl = $("#pestsValue");
const tempValueEl = $("#tempValue");

const irrigationRecommendationEl = $("#irrigationRecommendation");
const applyIrrigationBtn = $("#applyIrrigation");
const appliedStatusEl = $("#appliedStatus");

const activityListEl = $("#activityList");
const rangeSelect = $("#rangeSelect");
const waterChartCtx = document.getElementById("waterChart").getContext("2d");

// ---------- Init data ----------
let alerts = JSON.parse(localStorage.getItem(ALERTS_KEY) || "[]");
let appliedIrrigation = JSON.parse(localStorage.getItem(IRRIGATION_KEY) || "null");

// Simulated state sensors
let state = {
  humidity: getRandomInt(30, 85), // %
  pestsRisk: "low", // low | medium | high
  temperature: getRandomInt(12, 30) // °C
};

// ---------- Render helpers ----------
function renderAlertsList() {
  alertsListEl.innerHTML = "";
  const latest = alerts.slice(-5).reverse();
  if (latest.length === 0) {
    alertsListEl.innerHTML = `<div class="muted">No hay alertas recientes.</div>`;
    return;
  }
  latest.forEach(a => {
    const el = document.createElement("div");
    el.className = "alert-item";
    const color = a.level === "alto" ? "#e85d4f" : (a.level === "medio" ? "#f0b43a" : "#6cc070");
    el.innerHTML = `
      <div class="dot" style="background:${color};"></div>
      <div class="content">
        <div><strong>${a.type}</strong> — <span class="meta">${a.crop} · ${formatDate(a.ts)}</span></div>
        <div style="margin-top:6px;color:#586a58">${a.message}</div>
      </div>
    `;
    alertsListEl.appendChild(el);
  });
}

function renderAlertsHistory() {
  alertsHistoryEl.innerHTML = "";
  const reversed = alerts.slice().reverse();
  if (reversed.length === 0) {
    alertsHistoryEl.innerHTML = "<div class='muted'>No hay historial de alertas.</div>";
    return;
  }
  reversed.forEach(a => {
    const div = document.createElement("div");
    div.className = "alert-item";
    const color = a.level === "alto" ? "#e85d4f" : (a.level === "medio" ? "#f0b43a" : "#6cc070");
    div.innerHTML = `
      <div class="dot" style="background:${color};"></div>
      <div class="content">
        <div><strong>${a.type}</strong> — <span class="meta">${a.crop} · ${formatDate(a.ts)}</span></div>
        <div style="margin-top:6px;color:#586a58">${a.message}</div>
        <div style="margin-top:6px;font-size:12px;color:#7b8b7a">Recomendación: ${a.recommendation}</div>
      </div>
    `;
    alertsHistoryEl.appendChild(div);
  });
}

function renderStatusCards() {
  humidityValueEl.textContent = `${state.humidity} %`;
  tempValueEl.textContent = `${state.temperature} °C`;

  // pests text + color
  if (state.pestsRisk === "high") {
    pestsValueEl.textContent = "Alto riesgo";
    pestsValueEl.style.color = "#e85d4f";
  } else if (state.pestsRisk === "medium") {
    pestsValueEl.textContent = "Riesgo medio";
    pestsValueEl.style.color = "#f0b43a";
  } else {
    pestsValueEl.textContent = "Sin riesgo";
    pestsValueEl.style.color = "#3a9d4a";
  }

  // color shading of status items (optional)
  $("#status-humidity").style.borderColor = state.humidity < 35 ? "#f0b43a" : "#e6f4e6";
}

// ---------- Water chart (Chart.js) ----------
let waterChart;
function generateWaterData(days = 30) {
  // genera datos simulados (litros/día)
  const labels = [];
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(`${d.getDate()}/${d.getMonth()+1}`);
    // base + ruido
    const base = 500; // litros
    const noise = getRandomInt(-120, 120);
    data.push(Math.max(50, base + noise - Math.round((30 - Math.min(days,30)) * 2)));
  }
  return { labels, data };
}

function initChart(days = 30) {
  const { labels, data } = generateWaterData(days);
  if (waterChart) waterChart.destroy();
  waterChart = new Chart(waterChartCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Litros / día',
        data,
        borderColor: '#2ba84a',
        backgroundColor: 'rgba(43,168,74,0.12)',
        tension: 0.28,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// ---------- Irrigation recommendation ----------
function computeIrrigationRecommendation() {
  // Simple regla: si humedad < 40 => riego 30% (ejemplo)
  const humidity = state.humidity;
  let recommendation = "Nivel adecuado, no riego necesario.";
  if (humidity < 30) {
    recommendation = "Recomendar riego: 30 litros / m² (alto).";
  } else if (humidity < 45) {
    recommendation = "Recomendar riego: 18 litros / m² (moderado).";
  } else {
    recommendation = "Recomendar riego: 6 litros / m² (bajo).";
  }
  irrigationRecommendationEl.textContent = recommendation;
}

// ---------- Activity feed (simulada) ----------
function seedActivity() {
  const items = [
    { text: "Toma de muestra en parcela A1", ts: Date.now() - 1000*60*60*2 },
    { text: "Usuario aplicó guía: Control de pulgones", ts: Date.now() - 1000*60*60*6 },
    { text: "Reporte de consumo enviado (semana)", ts: Date.now() - 1000*60*60*24 },
  ];
  localStorage.setItem("ux_activity_demo", JSON.stringify(items));
}

function renderActivity() {
  const items = JSON.parse(localStorage.getItem("ux_activity_demo") || "[]");
  activityListEl.innerHTML = "";
  items.slice().reverse().forEach(i => {
    const li = document.createElement("li");
    li.className = "activity-item";
    li.innerHTML = `<div class="thumb">🌱</div><div><strong>${i.text}</strong><div class="meta" style="color:#6b8a6b;font-size:12px">${formatDate(i.ts)}</div></div>`;
    activityListEl.appendChild(li);
  });
}

// ---------- Alerts generation ----------
function createAlert(type = "Plaga detectada", level = "alto", crop = "Papa") {
  const message = (level === "alto") ? "Riesgo alto. Se detectó infestación en imágenes recientes." :
                 (level === "medio") ? "Riesgo medio. Recomendamos inspeccionar parcelas." :
                 "Riesgo bajo.";
  const recommendation = (type.includes("Plaga")) ? "Aplicar tratamiento X. Seguir pasos de la guía." : "Revisar condiciones.";

  const alert = {
    id: Date.now() + "-" + getRandomInt(1,9999),
    type,
    level, // alto | medio | bajo
    crop,
    ts: Date.now(),
    message,
    recommendation
  };
  alerts.push(alert);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  renderAlertsList();
  // notify visually
  flashTopNotification(`${type} (${crop}): ${message}`, level);
  seedActivityPush(`Alerta generada: ${type} en ${crop}`);
}

// top small notification
function flashTopNotification(text, level = "medio") {
  const n = document.createElement("div");
  n.style.position = "fixed";
  n.style.top = "12px";
  n.style.right = "12px";
  n.style.padding = "12px 14px";
  n.style.background = level === "alto" ? "#e85d4f" : (level === "medio" ? "#f0b43a" : "#6cc070");
  n.style.color = "#fff";
  n.style.borderRadius = "10px";
  n.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
  n.style.zIndex = 9999;
  n.textContent = text;
  document.body.appendChild(n);
  setTimeout(()=> n.remove(), 4200);
}

// push to activity
function seedActivityPush(text) {
  const items = JSON.parse(localStorage.getItem("ux_activity_demo") || "[]");
  items.push({ text, ts: Date.now() });
  localStorage.setItem("ux_activity_demo", JSON.stringify(items));
  renderActivity();
}

// ---------- Apply irrigation ----------
function loadAppliedIrrigation() {
  if (appliedIrrigation) {
    appliedStatusEl.textContent = `Aplicado: ${formatDate(appliedIrrigation.ts)}`;
  } else {
    appliedStatusEl.textContent = "No aplicado";
  }
}

function applyIrrigation() {
  appliedIrrigation = { ts: Date.now(), humidity: state.humidity };
  localStorage.setItem(IRRIGATION_KEY, JSON.stringify(appliedIrrigation));
  loadAppliedIrrigation();
  seedActivityPush("Usuario aplicó recomendación de riego");
  flashTopNotification("Recomendación marcada como aplicada", "bajo");
}

// ---------- Simulate sensors update ----------
function randomizeState() {
  state.humidity = Math.max(18, Math.min(92, state.humidity + getRandomInt(-6,6)));
  state.temperature = Math.max(6, Math.min(38, state.temperature + getRandomInt(-2,2)));
  // pests risk depends on humidity+random
  const score = state.humidity + getRandomInt(-20,20);
  if (score < 40) state.pestsRisk = "high";
  else if (score < 60) state.pestsRisk = "medium";
  else state.pestsRisk = "low";
  renderStatusCards();
  computeIrrigationRecommendation();
}

// ---------- Event listeners ----------
document.addEventListener("DOMContentLoaded", () => {
  // init
  seedActivity();
  renderActivity();
  renderAlertsList();
  initChart(parseInt(rangeSelect.value));
  computeIrrigationRecommendation();
  loadAppliedIrrigation();
  renderStatusCards();
  renderAlertsHistory();

  // open modal
  viewAllAlertsBtn.addEventListener("click", () => {
    alertsModal.classList.remove("hidden");
    renderAlertsHistory();
  });
  $("#closeAlertsModal").addEventListener("click", () => alertsModal.classList.add("hidden"));

  // simulate alert button
  btnSimulateAlert.addEventListener("click", () => {
    // generate random alert type/level
    const types = ["Plaga detectada", "Cambio climático", "Baja humedad"];
    const levels = ["alto","medio","bajo"];
    const type = types[getRandomInt(0, types.length-1)];
    const level = levels[getRandomInt(0, levels.length-1)];
    const crops = ["Papa", "Maíz", "Uva"];
    createAlert(type, level, crops[getRandomInt(0,crops.length-1)]);
  });

  // apply irrigation
  applyIrrigationBtn.addEventListener("click", () => applyIrrigation());

  // range change for chart
  rangeSelect.addEventListener("change", (e) => {
    initChart(parseInt(e.target.value));
  });

  // small periodic update (simulate sensors)
  setInterval(() => {
    randomizeState();
  }, 8000);

  // simulate an initial alert if none
  if (alerts.length === 0) {
    setTimeout(() => createAlert("Plaga detectada", "medio", "Papa"), 800);
  }

  const ctx = document.getElementById("waterChart").getContext("2d");
  const waterChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        datasets: [{
            label: "Consumo de agua (L)",
            data: [120, 140, 160, 110, 180, 200, 150],
            borderColor: "#2ecc71",
            backgroundColor: "rgba(46, 204, 113, 0.2)",
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: "#27ae60"
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,  // <-- evita que el gráfico se estire
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: true
            }
        }
    }
});

});
