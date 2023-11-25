import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert-custom alert-${type}`;
  alertDiv.textContent = message;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.classList.add('show');
  }, 10);

  setTimeout(() => {
    alertDiv.classList.remove('show');

    setTimeout(() => {
      alertDiv.remove();
    }, 310);
  }, 3000);
}

export const CarritoProvider = ({ children }) => {
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem("sessionId"));
  const [loadingMessage, setLoadingMessage] = useState("");

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
    const { id_producto, talleSeleccionado } = producto;

    if (!userId) {
      console.error("No hay sesión de usuario.");
      return;
    }

    if (!talleSeleccionado) {
      showAlert("Por favor, selecciona un talle antes de agregar al carrito.", "error");
      return;
    }

    try {
      setLoadingMessage("Añadiendo producto, espere por favor...");

      await axios.post(`carrito/${userId}`, {
        id_producto,
        cantidad,
        talle: talleSeleccionado,
      });

      await actualizarCarrito();

      // Agregar un pequeño retraso antes de mostrar el mensaje de éxito
      setTimeout(() => {
        showAlert("Producto agregado al carrito!", "success");
      }, 500);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    } finally {
      setLoadingMessage("");
    }
  };

  useEffect(() => {
    actualizarCarrito();
  }, [userId]);

  return (
    <CarritoContext.Provider value={{ cantidadProductos, totalCarrito, actualizarCarrito, agregarAlCarrito, loadingMessage }}>
      {children}
    </CarritoContext.Provider>
  );
};
