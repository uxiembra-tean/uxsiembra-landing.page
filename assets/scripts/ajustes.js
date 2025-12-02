// ---------- Cargar ajustes guardados ----------
window.onload = () => {
    const saved = JSON.parse(localStorage.getItem("ajustesUX")) || {};

    document.getElementById("alertaHeladas").checked = saved.alertaHeladas || false;
    document.getElementById("alertaLluvias").checked = saved.alertaLluvias || false;
    document.getElementById("alertaCalor").checked = saved.alertaCalor || false;
    document.getElementById("alertaViento").checked = saved.alertaViento || false;

    document.getElementById("sugerenciasCultivo").checked = saved.sugerenciasCultivo || false;
    document.getElementById("notifChat").checked = saved.notifChat || false;

    document.getElementById("temaSelect").value = saved.tema || "claro";
};


// ---------- Guardar ajustes ----------
document.getElementById("btnGuardarAjustes").addEventListener("click", () => {

    const prefs = {
        alertaHeladas: document.getElementById("alertaHeladas").checked,
        alertaLluvias: document.getElementById("alertaLluvias").checked,
        alertaCalor: document.getElementById("alertaCalor").checked,
        alertaViento: document.getElementById("alertaViento").checked,
        sugerenciasCultivo: document.getElementById("sugerenciasCultivo").checked,
        notifChat: document.getElementById("notifChat").checked,
        tema: document.getElementById("temaSelect").value
    };

    localStorage.setItem("ajustesUX", JSON.stringify(prefs));

    alert("✔ Ajustes guardados correctamente");
});
