import Carrusel from "./carrusel";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Inicio(props) {
  const generarLinkWhatsApp = (nombreProducto) => {
    const numero = "+5491126009633";
    const base = "https://api.whatsapp.com/send?phone=";
    const mensaje = `Hola! Me gustaría saber mas sobre este producto: ${nombreProducto}`;
    return `${base}${numero}&text=${encodeURIComponent(mensaje)}`;
  };

  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [categoriaNombre, setCategoriaNombre] = useState("Todos los productos");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { agregarAlCarrito } = props;

  const limit = window.innerWidth <= 768 ? 10 : 15;

  // Este useEffect se activará cuando el ID de categoría cambie
  useEffect(() => {
    setOffset(0); // Restablecer offset
    setHasMore(true); // Asumir que hay más productos hasta que se demuestre lo contrario
    setProductos([]); // Limpiar productos anteriores
  }, [id]);

  useEffect(() => {
    async function obtenerProductos() {
      let url = `productos?limit=${limit}&offset=${offset}`;

      if (id) {
        url += `&categoria=${id}`;
      }

      try {
        const response = await axios.get(url);

        if (response.data.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true); // Asegurarse de que el botón de "Mostrar más" permanezca activo si hay más productos
        }

        // Concatenar los nuevos productos al final del array existente
        setProductos((prevProductos) => [...prevProductos, ...response.data]);

        // Establecer el nombre de la categoría
        if (response.data[0]) {
          setCategoriaNombre(response.data[0].nombre_categoria);
        } else {
          setCategoriaNombre("Categoría sin productos");
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    }

    obtenerProductos();
  }, [id, offset]);

  return (
    <>
      <Carrusel />
      <div className="container mt-5">
        <h2 className="mb-4 text-white text-center">{categoriaNombre} Disponibles:</h2>
        <div className="row">
          {productos.map((producto) => (
            <div key={producto.id_producto} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-img-container">
                  <img src={producto.imagen} alt={producto.nombre} />
                </div>
                <div className="card-body">
                  <h5 className="card-title">
                    {producto.nombre} - {producto.precio}$
                  </h5>
                  <p className="card-text">{producto.descripcion}</p>
                  <div className="card-actions">
                    <button
                      className="btnn btn-primary"
                      onClick={() => agregarAlCarrito(producto.id_producto, 1)}
                    >
                      Agregar al Carrito
                    </button>
                    <a
                      href={generarLinkWhatsApp(producto.nombre)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success ml-2"
                    >
                      <i className="fa fa-whatsapp"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-4">
            <button
              className="btn btnnn-primary"
              onClick={() => setOffset((prevOffset) => prevOffset + limit)}
            >
              Mostrar más
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Inicio;
