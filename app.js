// ===============================
// CARGAR O CREAR PRODUCTOS
// ===============================
let productos = JSON.parse(localStorage.getItem("productos")) || [
];
let carrito = [];



// ===============================
// ELEMENTOS DEL DOM
// ===============================
const listaProductos = document.getElementById("listaProductos");
const buscador = document.getElementById("buscador");
const inputNombre = document.getElementById("inputNombre");
const inputPrecio = document.getElementById("inputPrecio");
const btnAgregar = document.getElementById("btnAgregar");
const btnVaciar = document.getElementById("btnVaciar");

const btnAbrirCarrito = document.getElementById("btnAbrirCarrito");
const carritoPanel = document.getElementById("carritoPanel");

btnAbrirCarrito.addEventListener("click", () => {
  carritoPanel.classList.toggle("oculto");
});


const listaCarrito = document.getElementById("listaCarrito");
const totalSpan = document.getElementById("totalCarrito");

const btnCerrarCarrito = document.getElementById("btnCerrarCarrito");

btnCerrarCarrito.addEventListener("click", () => {
  carritoPanel.classList.add("oculto");
});


function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.precio * item.cantidad;

    const div = document.createElement("div");
    div.className = "item-carrito";

    div.innerHTML = `
      <span>${item.nombre} x${item.cantidad}</span>
      <span>$${item.precio * item.cantidad}</span>
      <button class="quitar">❌</button>
    `;

    div.querySelector(".quitar").addEventListener("click", () => {
      eliminarDelCarrito(index);
    });

    listaCarrito.appendChild(div);
  });

  totalSpan.textContent = total;
}

function eliminarDelCarrito(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad--;
  } else {
    carrito.splice(index, 1);
  }
  actualizarCarrito();
}



// ===============================
// GUARDAR EN LOCALSTORAGE
// ===============================
function guardarProductos() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

// ===============================
// MOSTRAR PRODUCTOS
// ===============================
function mostrarProductos(filtro = "") {
  listaProductos.innerHTML = "";

  productos.forEach((producto, index) => {
    if (producto.nombre.toLowerCase().includes(filtro.toLowerCase())) {

      const div = document.createElement("div");
      div.className = "producto";

      div.innerHTML = `
        <div class="info">
          <span class="nombre">${producto.nombre}</span>
          <span class="precio">$${producto.precio}</span>
        </div>

        <div class="acciones">
          <button class="carrito">🛒</button>
          <button class="editar">✏️</button>
          <button class="eliminar">❌</button>
        </div>
      `;

      // 🛒 AGREGAR AL CARRITO
      div.querySelector(".carrito").addEventListener("click", () => {
        agregarAlCarrito(producto);
      });


      // ✏️ EDITAR
      div.querySelector(".editar").addEventListener("click", () => {
        editarProducto(index);
      });

      // ❌ ELIMINAR
      div.querySelector(".eliminar").addEventListener("click", () => {
        eliminarProducto(index);
      });

      listaProductos.appendChild(div);
    }
  });
}


// ===============================
// AGREGAR PRODUCTO
// ===============================
btnAgregar.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  const precio = inputPrecio.value.trim();

  if (nombre === "" || precio === "") {
    alert("Completa todos los campos");
    return;
  }

  productos.push({
    nombre: nombre,
    precio: Number(precio)
  });

  guardarProductos();
  mostrarProductos();

  inputNombre.value = "";
  inputPrecio.value = "";
});

// ===============================
// EDITAR PRODUCTO
// ===============================
function editarProducto(index) {
  const nuevoPrecio = prompt(
    `Nuevo precio para ${productos[index].nombre}:`,
    productos[index].precio
  );

  if (nuevoPrecio === null || nuevoPrecio === "") return;

  productos[index].precio = Number(nuevoPrecio);
  guardarProductos();
  mostrarProductos();
}

// ===============================
// ELIMINAR PRODUCTO
// ===============================
function eliminarProducto(index) {
  const confirmar = confirm(
    `¿Eliminar ${productos[index].nombre}?`
  );

  if (!confirmar) return;

  productos.splice(index, 1);
  guardarProductos();
  mostrarProductos();
}

function agregarAlCarrito(producto) {
  const item = carrito.find(p => p.nombre === producto.nombre);

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  actualizarCarrito();
  carritoPanel.classList.remove("oculto");
}

btnVaciar.addEventListener("click", () => {
  carrito = [];
  actualizarCarrito();
});



// ===============================
// BUSCADOR
// ===============================
buscador.addEventListener("input", () => {
  mostrarProductos(buscador.value);
});

// ===============================
// INICIAR APP
// ===============================
mostrarProductos();
