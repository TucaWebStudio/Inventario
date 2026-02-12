// ===== INVENTARIO COMPARTIDO =====
let inventario = JSON.parse(localStorage.getItem("inventario")) || [];

// Guardar inventario global
function guardarInventario() {
    localStorage.setItem("inventario", JSON.stringify(inventario));
}

// Renderizar productos
function renderProductos(lista = inventario) {
    const contenedor = document.getElementById("productosContainer");
    contenedor.innerHTML = "";

    lista.forEach((p, index) => {
        contenedor.innerHTML += `
        <div class="producto-card">
            <img src="${p.imagen}" class="producto-imagen">
            <div class="producto-info">
                <p class="producto-nombre">${p.nombre}</p>
                <p class="producto-codigo">${p.codigo}</p>
                <p class="producto-cantidad">Stock: ${p.cantidad}</p>

                <div class="producto-cantidad-contenedor">
                    <input type="number" min="1" class="input-cantidad" id="cantidad-${index}">
                </div>

                <div class="producto-acciones">
                    <button class="btn btn-agregar" onclick="agregarStock(${index})">+</button>
                    <button class="btn btn-quitar" onclick="quitarStock(${index})">-</button>
                </div>
            </div>
        </div>
        `;
    });
}

// Agregar stock
function agregarStock(index) {
    const input = document.getElementById(`cantidad-${index}`);
    const cantidad = parseInt(input.value) || 1;

    inventario[index].cantidad += cantidad;
    guardarInventario();
    renderProductos();
}

// Quitar stock
function quitarStock(index) {
    const input = document.getElementById(`cantidad-${index}`);
    const cantidad = parseInt(input.value) || 1;

    inventario[index].cantidad -= cantidad;
    if (inventario[index].cantidad < 0) inventario[index].cantidad = 0;

    guardarInventario();
    renderProductos();
}

// ===== MODAL =====
const modal = document.getElementById("modalAgregarProducto");
document.getElementById("btnAgregarProducto").onclick = () => modal.classList.add("show");
document.querySelector(".modal-cerrar").onclick = () => modal.classList.remove("show");

// Agregar producto
document.getElementById("formAgregarProducto").addEventListener("submit", e => {
    e.preventDefault();

    const nuevoProducto = {
        id: Date.now(),
        nombre: inputNombre.value,
        codigo: inputCodigo.value,
        cantidad: parseInt(inputCantidad.value),
        imagen: inputImagen.value,
        precio: Math.floor(Math.random() * 100) + 10 // precio base
    };

    inventario.push(nuevoProducto);
    guardarInventario();
    renderProductos();
    modal.classList.remove("show");
    e.target.reset();
});

// ===== BÚSQUEDA =====
document.getElementById("barraBusqueda").addEventListener("input", e => {
    const texto = e.target.value.toLowerCase();
    const filtrados = inventario.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.codigo.toLowerCase().includes(texto)
    );
    renderProductos(filtrados);
});

// INIT
renderProductos();

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