function loginValidator() {
    const usuarioInput = document.getElementById("usuario");
    const passwordInput = document.getElementById("password");
    const error = document.getElementById("error");

    if (!usuarioInput || !passwordInput) {
        console.error("No se encontraron los inputs");
        return;
    }

    const usuario = usuarioInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    // 🔐 Usuarios del sistema
    const usuarios = [
        { user: "admin", pass: "admin12345", rol: "admin" },
        { user: "usuario", pass: "usuario123", rol: "usuario" }
    ];

    const encontrado = usuarios.find(
        u => u.user === usuario && u.pass === password
    );

    if (encontrado) {
        localStorage.setItem("sesion", "activa");
        localStorage.setItem("usuario", encontrado.user);
        localStorage.setItem("rol", encontrado.rol);

        window.location.href = "Inventario/inventario.html";
    } else {
        error.textContent = "Usuario o contraseña incorrectos";
    }
}