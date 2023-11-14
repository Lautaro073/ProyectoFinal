import React from 'react';
import axios from 'axios';
import Alerta from '../../pages/Alerta';
function AgregarAlCarritoBoton({ idProducto, nombreProducto }) {
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
    const agregarAlCarrito = async () => {
        try {
            const idCarrito = localStorage.getItem('idCarrito') || null;
            
            const respuesta = await axios.post('carrito', { 
                idCarrito, 
                idProducto
            });
            
            if (respuesta.data && respuesta.data.idCarrito) {
                localStorage.setItem('idCarrito', respuesta.data.idCarrito);
            }
            
            showAlert(`${nombreProducto} ha sido agregado al carrito.`, "success");
        } catch (error) {
            showAlert('Hubo un error al agregar el producto al carrito.', "error");
            console.error(error);
        }
    };

    return (
        <button onClick={agregarAlCarrito}>
            Agregar al carrito
        </button>
    );
}

export default AgregarAlCarritoBoton;
