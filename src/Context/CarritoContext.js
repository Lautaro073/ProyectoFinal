// CarritoContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

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

  const agregarAlCarrito = async (id_producto, cantidad = 1) => {
    if (!userId) {
      console.error("No hay sesión de usuario.");
      return;
    }
    try {
      await axios.post(`carrito/${userId}`, { id_producto, cantidad });
      await actualizarCarrito(); // Actualiza el estado del carrito después de agregar un ítem
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
