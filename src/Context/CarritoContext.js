// CarritoContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-custom alert-${type}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    // Dar un pequeño tiempo para que la alerta inicialice y luego agregar la clase 'show'
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 10);

    // Después de 3 segundos, remover la alerta
    setTimeout(() => {
        alertDiv.classList.remove('show');
        // Esperamos que termine la transición de salida y luego eliminamos el elemento del DOM
        setTimeout(() => {
            alertDiv.remove();
        }, 310); // 10 ms adicionales para asegurarnos de que la transición ha terminado
    }, 3000);
}

export const CarritoProvider = ({ children }) => {
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem("sessionId"));

  const actualizarCarrito = async () => {
    if (userId) {
      try {
        const response = await axios.get(`carrito/${userId}`);
        const productos = response.data;
        let total = productos.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        setCantidadProductos(productos.length);
        setTotalCarrito(total);
      } catch (error) {
        console.error("Error al obtener el carrito", error);
      }
    }
  };

  const agregarAlCarrito = async (producto, cantidad = 1) => {
  // Asegúrate de que producto incluye id_producto y talleSeleccionado
  const { id_producto, talleSeleccionado } = producto;

  if (!userId) {
    console.error("No hay sesión de usuario.");
    return;
  }

  // Verificar si se seleccionó un talle antes de agregar al carrito
  if (!talleSeleccionado) {
    showAlert("Por favor, selecciona un talle antes de agregar al carrito.", "error");
    return;
  }

  try {
    // Incluye el talleSeleccionado en la solicitud POST
    await axios.post(`carrito/${userId}`, {
      id_producto,
      cantidad,
      talle: talleSeleccionado, // Asegúrate de que el backend espera un campo 'talle'
    });

    await actualizarCarrito(); // Actualiza el estado del carrito después de agregar un ítem
    showAlert("Producto agregado al carrito!", "success");
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
  }
};


  // Observa cambios en el userId y actualiza el carrito si cambia
  useEffect(() => {
    actualizarCarrito();
  }, [userId]);

  return (
    <CarritoContext.Provider value={{ cantidadProductos, totalCarrito, actualizarCarrito, agregarAlCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};