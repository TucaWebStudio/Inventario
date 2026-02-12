document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     LOCAL STORAGE
  ====================== */
  const getLS = key => JSON.parse(localStorage.getItem(key)) || [];
  const setLS = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  let inventario = getLS("inventario");
  let ventas = getLS("ventas");

  /* ======================
     ELEMENTOS
  ====================== */
  const tablaProductos = document.getElementById("tablaProductos");
  const masVendidos = document.getElementById("masVendidos");
  const menosVendidos = document.getElementById("menosVendidos");

  const form = document.getElementById("formNuevoProducto");
  const nombreInput = document.getElementById("nuevoProductoNombre");
  const compraInput = document.getElementById("nuevoProductoPrecioCompra");
  const ventaInput = document.getElementById("nuevoProductoPrecioVenta");
  const stockInput = document.getElementById("nuevoProductoStock");

  const gananciaTexto = document.getElementById("gananciaNeta");

  /* ======================
     RENDER TABLA
  ====================== */
  function renderTabla() {
    tablaProductos.innerHTML = "";

    if (inventario.length === 0) {
      tablaProductos.innerHTML = `
        <tr><td colspan="5">No hay productos registrados</td></tr>
      `;
      return;
    }

    inventario.forEach((p, index) => {
      tablaProductos.innerHTML += `
        <tr>
          <td>${p.nombre}</td>
          <td><input type="number" value="${p.precioCompra}" onchange="editarProducto(${index}, 'precioCompra', this.value)"></td>
          <td><input type="number" value="${p.precioVenta}" onchange="editarProducto(${index}, 'precioVenta', this.value)"></td>
          <td><input type="number" value="${p.cantidad}" min="0" onchange="editarProducto(${index}, 'cantidad', this.value)"></td>
          <td><button class="btn-editar" onclick="eliminarProducto(${index})">Eliminar</button></td>
        </tr>
      `;
    });
  }

  /* ======================
     EDITAR / ELIMINAR
  ====================== */
  window.editarProducto = (index, campo, valor) => {
    inventario[index][campo] = Number(valor);
    setLS("inventario", inventario);
    actualizarGrafica();
  };

  window.eliminarProducto = index => {
    if (!confirm("¿Eliminar producto?")) return;
    inventario.splice(index, 1);
    setLS("inventario", inventario);
    renderTabla();
    renderRanking();
    actualizarGrafica();
  };

  /* ======================
     AGREGAR PRODUCTO
  ====================== */
  form.addEventListener("submit", e => {
    e.preventDefault();

    inventario.push({
      id: Date.now(),
      nombre: nombreInput.value.trim(),
      precioCompra: Number(compraInput.value),
      precioVenta: Number(ventaInput.value),
      cantidad: Number(stockInput.value),
      imagen: "https://via.placeholder.com/150"
    });

    setLS("inventario", inventario);
    form.reset();
    renderTabla();
    renderRanking();
    actualizarGrafica();
  });

  /* ======================
     RANKING VENTAS
  ====================== */
  function renderRanking() {
    const conteo = {};

    inventario.forEach(p => conteo[p.id] = { nombre: p.nombre, cantidad: 0 });

    ventas.forEach(v => {
      v.productos.forEach(p => {
        if (conteo[p.id]) conteo[p.id].cantidad += p.cantidad;
      });
    });

    const ordenados = Object.values(conteo).sort((a, b) => b.cantidad - a.cantidad);

    masVendidos.innerHTML = "";
    menosVendidos.innerHTML = "";

    ordenados.slice(0, 5).forEach(p =>
      masVendidos.innerHTML += `<li>${p.nombre} - ${p.cantidad}</li>`
    );

    ordenados.slice(-5).forEach(p =>
      menosVendidos.innerHTML += `<li>${p.nombre} - ${p.cantidad}</li>`
    );
  }

  /* ======================
     GRÁFICA + GANANCIA
  ====================== */
  let chart;

  function actualizarGrafica() {
    let ingresos = 0;
    let costos = 0;

    ventas.forEach(v => {
      v.productos.forEach(p => {
        const prod = inventario.find(i => i.id === p.id);
        if (!prod) return;

        ingresos += p.precio * p.cantidad;
        costos += prod.precioCompra * p.cantidad;
      });
    });

    const ganancia = ingresos - costos;
    gananciaTexto.textContent = `Ganancia neta: $${ganancia.toFixed(2)}`;

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("chartIngresos"), {
      type: "bar",
      data: {
        labels: ["Ingresos", "Costos"],
        datasets: [{
          data: [ingresos, costos]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  /* ======================
     INIT
  ====================== */
  renderTabla();
  renderRanking();
  actualizarGrafica();
});

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

document.addEventListener("DOMContentLoaded", () => {
    const rol = localStorage.getItem("rol");

    if (rol !== "admin") {
        alert("No tienes permisos para acceder a esta sección");
        window.location.href = "../Inventario/inventario.html";
    }
});

const categoriaInput = document.getElementById("nuevoProductoCategoria");

inventario.push({
    id: Date.now(),
    nombre: nombreInput.value.trim(),
    categoria: categoriaInput.value,
    precioCompra: Number(compraInput.value),
    precioVenta: Number(ventaInput.value),
    cantidad: Number(stockInput.value),
    imagen: "https://via.placeholder.com/150"
});