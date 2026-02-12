/* ======================
   DATOS BASE
====================== */
let inventario = JSON.parse(localStorage.getItem("inventario")) || [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

/* ======================
   GUARDAR
====================== */
function guardarDatos() {
    localStorage.setItem("inventario", JSON.stringify(inventario));
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("ventas", JSON.stringify(ventas));
}

/* ======================
   RENDER PRODUCTOS
====================== */
function renderProductos() {
    const contenedor = document.getElementById("productosContainer");
    contenedor.innerHTML = "";

    inventario.forEach(p => {
        const sinStock = p.cantidad <= 0;
        const stockBajo = p.cantidad > 0 && p.cantidad <= 3;

        contenedor.innerHTML += `
        <div class="producto-card ${sinStock ? 'agotado' : ''}">
            <img src="${p.imagen}">
            <h4>${p.nombre}</h4>
            <p>Stock: ${p.cantidad}</p>

            ${stockBajo ? `<p style="color:#F23D4C;font-weight:bold;">STOCK BAJO</p>` : ""}

            <div class="controles">
            <button class="btn-mas" onclick="sumarUnidad(${p.id})" ${sinStock ? "disabled" : ""}>+</button>
                <button class="btn-menos" onclick="restarUnidad(${p.id})">−</button>
                
            </div>

            ${sinStock ? `<p class="texto-agotado">AGOTADO</p>` : ""}
        </div>
        `;
    });
}

/* ======================
   SUMAR (+)
====================== */
function sumarUnidad(id) {
    const producto = inventario.find(p => p.id === id);
    if (!producto || producto.cantidad <= 0) return;

    producto.cantidad--;

    const enCarrito = carrito.find(p => p.id === id);
    if (enCarrito) {
        enCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precioVenta), // 🔥 FIX
            cantidad: 1
        });
    }

    guardarDatos();
    renderProductos();
    renderCarrito();
}

/* ======================
   RESTAR (−)
====================== */
function restarUnidad(id) {
    const enCarrito = carrito.find(p => p.id === id);
    if (!enCarrito) return;

    enCarrito.cantidad--;

    const producto = inventario.find(p => p.id === id);
    producto.cantidad++;

    if (enCarrito.cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== id);
    }

    guardarDatos();
    renderProductos();
    renderCarrito();
}

/* ======================
   RENDER CARRITO
====================== */
function renderCarrito() {
    const lista = document.getElementById("listaCarrito");
    lista.innerHTML = "";

    let subtotal = 0;

    carrito.forEach(p => {
        const totalProducto = p.precio * p.cantidad;
        subtotal += totalProducto;

        lista.innerHTML += `
        <li>
            <span>${p.nombre} x${p.cantidad}</span>
            <span>$${totalProducto.toFixed(2)}</span>
        </li>
        `;
    });

    const iva = subtotal * 0.08;
    document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("iva").innerText = `$${iva.toFixed(2)}`;
    document.getElementById("total").innerText = `$${(subtotal + iva).toFixed(2)}`;
}

/* ======================
   MODAL DE PAGO
====================== */
function abrirPago() {
    const resumen = document.getElementById("resumenPago");
    resumen.innerHTML = "";

    let total = 0;

    carrito.forEach(p => {
        total += p.precio * p.cantidad;
        resumen.innerHTML += `<p>${p.nombre} x${p.cantidad}</p>`;
    });

    resumen.innerHTML += `<hr><strong>Total: $${(total * 1.08).toFixed(2)}</strong>`;
    document.getElementById("modalPago").style.display = "flex";
}

function cerrarPago() {
    document.getElementById("modalPago").style.display = "none";
}

function confirmarPago() {
    ventas.push({
        fecha: new Date().toLocaleString(),
        productos: [...carrito],
        total: document.getElementById("total").innerText
    });

    carrito = [];
    guardarDatos();
    cerrarPago();
    renderCarrito();
    alert("Venta registrada correctamente");
}

/* ======================
   INICIAR
====================== */
renderProductos();
renderCarrito();

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