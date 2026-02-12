document.addEventListener("DOMContentLoaded", () => {
    const rol = localStorage.getItem("rol");
    const sesion = localStorage.getItem("sesion");

    if (sesion !== "activa") {
        window.location.href = "../Login/login.html";
        return;
    }

    if (rol === "usuario") {
        document.querySelectorAll(".solo-admin")
            .forEach(e => e.style.display = "none");
    }
});