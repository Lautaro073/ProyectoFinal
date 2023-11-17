import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import notFound from '../../assets/imagen not found.png';
import { useCarrito } from "../../Context/CarritoContext"; // Asegúrate de usar la ruta correcta

function ProductosPorCategoria() {
  const { agregarAlCarrito } = useCarrito(); // Obtiene agregarAlCarrito del contexto

  const generarLinkWhatsApp = (nombreProducto) => {
    const numero = "+5491126009633";
    const base = "https://api.whatsapp.com/send?phone=";
    const mensaje = `Hola! Me gustaría saber más sobre este producto: ${nombreProducto}`;
    return `${base}${numero}&text=${encodeURIComponent(mensaje)}`;
  };

  const [productos, setProductos] = useState([]);
  const params = useParams();
  const categoriaNombre = params.categoria;

  useEffect(() => {
    async function obtenerProductos() {
      try {
        const response = await axios.get(`categorias/categoria/${categoriaNombre}`);
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    }

    obtenerProductos();
  }, [categoriaNombre]);
  return (
    <>
      <div className="main-container">
        <div className="container mt-5">
          <h2 className="mb-4 text-white">{categoriaNombre} disponibles:</h2>
          <div className="row">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <div key={producto.id_producto} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-img-container">
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="img-fluid"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = {notFound};
                        }}
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        {producto.nombre} - {producto.precio}$
                      </h5>
                      <p className="card-text">{producto.descripcion}</p>
                      <div className="card-actions">
                        <button
                          className="btnn btn-primary"
                          onClick={() =>
                            agregarAlCarrito(producto.id_producto, 1)
                          }
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
              ))
            ) : (
              <div className="col-12 text-center text-white">
                Por el momento no hay productos disponibles en la categoría{" "}
                {categoriaNombre}.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductosPorCategoria;
