import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProductosPorCategoria() {
    
    const { categoria } = useParams(); // Extraer categoria desde useParams
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        async function obtenerProductos() {
             if (!categoria) {
        console.warn("Categoría no definida");
        return;
    }
            try {
                const response = await axios.get(`productos/categoria/${categoria.nombre_categoria}`);
                setProductos(response.data);
            } catch (error) {
                console.error("Error al obtener productos por categoría:", error);
            }
        }

        obtenerProductos();
    }, [categoria]);

    return (
        <div>
            <h2>Productos en la categoría: {categoria}</h2>
            <ul>
                {productos.map(producto => (
                    <li key={producto.id}>
                        {producto.nombre} - ${producto.precio}
                        {producto.descripcion}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductosPorCategoria;

