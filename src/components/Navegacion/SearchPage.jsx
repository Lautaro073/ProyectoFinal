// SearchPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function SearchPage({ agregarAlCarrito }) {
  const generarLinkWhatsApp = (nombreProducto) => {
    const numero = "+5491126009633";
    const base = "https://api.whatsapp.com/send?phone=";
    const mensaje = `Hola! Me gustaría saber mas sobre este producto: ${nombreProducto}`;
    return `${base}${numero}&text=${encodeURIComponent(mensaje)}`;
  };

  const [productos, setProductos] = useState([]);
  const searchQuery = new URLSearchParams(window.location.search).get("search");

  useEffect(() => {
    axios
      .get(`productos/search?search=${searchQuery}`)
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error en la búsqueda:", error);
      });
  }, [searchQuery]);

  return (
    <>
    <div className="main-container">
      <div className="container mt-5">
        <h2 className="mb-4">Productos disponibles:</h2>
        {productos.length > 0 ? (
          <div className="row">
            {productos.map((producto) => (
              <div key={producto.id_producto} className="col-md-4 mb-4">
                <div className="card">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="img-fluid"
                  />
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
            ))}
          </div>
        ) : (
          <p>No se encontraron productos con el nombre "{searchQuery}".</p>
        )}
      </div>
      </div>
    </>
  );
}

export default SearchPage;
