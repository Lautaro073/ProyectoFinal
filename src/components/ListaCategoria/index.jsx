import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListaCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        // Obtener todas las categorías cuando se carga el componente
        async function obtenerCategorias() {
            try {
                const response = await axios.get('categorias');
                setCategorias(response.data);
            } catch (error) {
                console.error("Error al obtener las categorías:", error);
            }
        }

        obtenerCategorias();
    }, []);

    async function obtenerProductosPorCategoria(id_categoria) {
        try {
            const response = await axios.get(`productos/categoria/${id_categoria}`);
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener productos por categoría:", error);
        }
    }

    return (
        <div>
            <h2>Categorías</h2>
            <ul>
                {categorias.map(categoria => (
                    <li key={categoria.id_categoria} onClick={() => obtenerProductosPorCategoria(categoria.id_categoria)}>
                        {categoria.nombre}
                    </li>
                ))}
            </ul>

            <h2>Productos</h2>
            <ul>
                {productos.map(producto => (
                    <li key={producto.id}>
                        {producto.nombre}
                        {producto.descripcion}
                        {producto.precio}
                        {producto.stock}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaCategorias;
