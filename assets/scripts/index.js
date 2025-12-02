document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".topheader");
    const menu = document.querySelector(".menu");

    header.addEventListener("click", (e) => {
        // Solo funciona en celular
        if (window.innerWidth > 768) return;

        // Evita que se abra cuando se clickea dentro del menú
        if (e.target.closest(".menu")) return;

        header.classList.toggle("open");
        menu.classList.toggle("active");
    });
});
