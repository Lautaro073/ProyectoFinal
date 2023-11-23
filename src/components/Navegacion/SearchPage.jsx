import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCarrito } from "../../Context/CarritoContext";
import CustomModal from '../Inicio/CustomModal'; // Reemplaza 'tu/ruta/al/CustomModal' con la ruta correcta

function SearchPage() {
  const { agregarAlCarrito } = useCarrito();
  const [productos, setProductos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const searchQuery = new URLSearchParams(window.location.search).get("search");
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
  useEffect(() => {
    axios
      .get(`productos/search?search=${searchQuery}`)
      .then((response) => {
        const productosConTalle = response.data.map((producto) => ({
          ...producto,
          tallesDisponibles: producto.talle.split(","), // Suponiendo que la respuesta es un string separado por comas
          talleSeleccionado: ""
        }));
        setProductos(productosConTalle);
      })
      .catch((error) => {
        console.error("Error en la búsqueda:", error);
      });
  }, [searchQuery]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="main-container">
        <div className="container mt-5">
          <h2 className="mb-4">Productos disponibles:</h2>
          {productos.length > 0 ? (
            <div className="row">
              {productos.map((producto) => (
                <div key={producto.id_producto} className="col-md-4 mb-4">
                  <div className="card" onClick={() => openModal(producto)}>
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
                        <div className="form-group select-container">
                          <select
                            id={`talleSelect-${producto.id_producto}`}
                            className="form-control"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const talleSeleccionado = e.target.value;
                              const nuevosProductos = productos.map((p) =>
                                p.id_producto === producto.id_producto
                                  ? { ...p, talleSeleccionado }
                                  : p
                              );
                              setProductos(nuevosProductos);
                            }}
                            value={producto.talleSeleccionado}
                          >
                            <option value="" disabled>
                              Talle
                            </option>
                            {producto.tallesDisponibles.map((talle) => (
                              <option key={talle} value={talle}>
                                {talle}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          className="btnn btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (producto.talleSeleccionado) {
                              agregarAlCarrito(producto.id_producto, 1);
                            } else {
                              showAlert(
                                "Por favor, selecciona un talle antes de agregar al carrito."
                              ,"error");
                            }
                          }}
                        >
                          Añadir al Carrito
                        </button>
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

      {modalIsOpen && (
        <CustomModal
  isOpen={modalIsOpen}
  closeModal={closeModal}
  product={selectedProduct}
/>

      )}
    </>
  );
}

export default SearchPage;
