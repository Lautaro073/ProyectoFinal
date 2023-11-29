import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Asegúrate de importar correctamente el componente PaymentButton
import { useCarrito } from "../../Context/CarritoContext";
import Preload from "../../components/Preload/index";
import "../../config";

function Carrito() {
  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-custom alert-${type}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    // Dar un pequeño tiempo para que la alerta inicialice y luego agregar la clase 'show'
    setTimeout(() => {
      alertDiv.classList.add("show");
    }, 10);

    // Después de 3 segundos, remover la alerta
    setTimeout(() => {
      alertDiv.classList.remove("show");
      // Esperamos que termine la transición de salida y luego eliminamos el elemento del DOM
      setTimeout(() => {
        alertDiv.remove();
      }, 310); // 10 ms adicionales para asegurarnos de que la transición ha terminado
    }, 3000);
  }
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("sessionId");
  const carritoId = sessionId;
  const { actualizarCarrito } = useCarrito();
  const [cargaCompleta, setCargaCompleta] = useState(false);

  const cargarProductos = useCallback(() => {
    axios.get(`carrito/${carritoId}`).then((respuesta) => {
      console.log("Productos desde el servidor:", respuesta.data);
      setProductos(respuesta.data);
      setCargaCompleta(true);
    });
  }, [carritoId]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);


  const agregarProducto = async (productoId, talle) => {
    console.log("Producto ID:", productoId); // Agrega esta línea
    try {
      const stockActual = await verificarStock(productoId);

      // Obtén el producto del estado productos del carrito
      const producto = productos.find((p) => p.id_producto === productoId);

      // Verifica si ya hay productos en el carrito
      if (producto) {
        // Verifica si agregar más productos excederá el stock disponible
        if (producto.cantidad + 1 > stockActual) {
          showAlert(
            "No hay suficiente stock disponible para agregar más productos.",
            "error"
          );
          return;
        }
      } else {
        // Si no hay productos del mismo tipo en el carrito, verifica si la cantidad a agregar supera el stock disponible
        if (1 > stockActual) {
          showAlert(
            "No hay suficiente stock disponible para agregar más productos.",
            "error"
          );
          return;
        }
      }

      // Continúa con el proceso de agregar el producto al carrito
      const response = await axios.post(`carrito/${carritoId}`, {
        id_producto: productoId,
        cantidad: 1,
        talle: talle, // Asegúrate de enviar el talle al backend
      });
      await actualizarCarrito();
      if (response.status === 201 || response.status === 200) {
        cargarProductos();
        showAlert("Producto agregado", "success");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const quitarProducto = async (productoId, talle) => {
    console.log("ID recibido:", productoId);
    console.log("Lista de productos:", productos);
    try {
      const producto = productos.find(
        (p) => p.id_producto === productoId && p.talle === talle
      );
      if (!producto) {
        console.error("Producto no encontrado:", productoId);
        return;
      }
  
      let response;
      if (producto.cantidad > 1) {
        // Si hay más de una unidad, simplemente reducimos la cantidad
        response = await axios.put(
          `carrito/${carritoId}/${productoId}/${talle}`,
          {
            cantidad: producto.cantidad - 1,
          }
        );
      } else {
        // Si hay solo una unidad, eliminamos el producto del carrito
        response = await axios.delete(
          `carrito/${carritoId}/${productoId}/${talle}`
        );
      }
      await actualizarCarrito();
      if (response.status === 200) {
        cargarProductos();
        showAlert("Producto eliminado", "error");
      }

    } catch (error) {
      console.error("Error al quitar producto:", error);
    }
  };
  

  const verificarStock = async (productoId) => {
    if (!productoId) {
      console.error("Producto ID no definido");
      return 0;
    }
    const response = await axios.get(`productos/${productoId}/stock`);

    return response.data.stock;
  };

  const calcularTotal = () => {
    return productos.reduce(
      (acc, producto) => acc + producto.precio * producto.cantidad,
      0
    );
  };

  const [paymentUrl, setPaymentUrl] = useState("");

  const handlePayment = async () => {
    try {
      // Concatena los nombres de todos los productos en el carrito
      const productDetails = productos
        .map((producto) => `${producto.nombre} (Talle: ${producto.talle})`)
        .join(", ");
        const total = calcularTotal();
     const checkoutData = {
    // ...todos los otros datos necesarios para el checkout...
    total_pedido: total, // Asegúrate de enviar el total calculado
  };
   const response = await axios.post("create_preference", {
        title: `Compra de: ${productDetails}`, // Incluye los nombres de los productos en el título
        quantity: 1,
        price: calcularTotal(),
      });

      setPaymentUrl(response.data);
    } catch (error) {
      console.log("Error al crear la preferencia", error);
    }
  };
  


  useEffect(() => {
    // Verifica si el parámetro "status" está presente en la URL
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get("status");
  
    if (paymentStatus) {
      if (paymentStatus === null) {
        navigate("/carrito");
      } 
    }
  }, []);
  return (
    <div className="main-container">
      <div className="container mt-4">
        <h2 style={{ color: "white" }}>Productos en el Carrito</h2>

        {!cargaCompleta ? (
          <Preload />
        ) : productos.length === 0 ? (
          <div className="alert alert-dark" role="alert">
            No hay productos en el carrito.
          </div>
        ) : (
          <div>
            {productos.map((producto, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center py-2"
                style={{
                  borderBottom: "1px solid #ff4500",
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  width="50"
                  height="50"
                  className="mr-3"
                />
                <div>
                  <h5 className="mb-1">{producto.nombre}</h5>
                  <p className="mb-1">Talle: {producto.talle}</p>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-outline-danger mr-2"
                    onClick={() =>
                      quitarProducto(producto.id_producto, producto.talle)
                    }
                  >
                    -
                  </button>
                  <span className="badge bg-black text-white rounded-pill mr-2 ml-2">
                    {producto.cantidad}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-success ml-2"
                    onClick={() =>
                      agregarProducto(producto.id_producto, producto.talle)
                    }
                  >
                    +
                  </button>

                  <div className="badge bg-primary rounded-pill ml-3">
                    ${producto.precio * producto.cantidad}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {productos.length > 0 && (
          <div className="mt-3">
            {paymentUrl ? (
              <a
                className="btn btn-primary"
                href={paymentUrl}
                rel="noopener noreferrer"
              >
                Pagar con Mercado Pago
              </a>
            ) : (
              <button className="btnn btn-principal" onClick={handlePayment} id="btn-pagar">
                {" "}
                Proceder al Pago - Total: ${calcularTotal()}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;
