import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCarrito } from "../../Context/CarritoContext";
import CustomModal from '../../components/Inicio/CustomModal';
import notFound from '../../assets/imagen not found.png';
import Preload from "../../components/Preload/index";

function ProductosPorCategoria() {
  const { agregarAlCarrito, loadingMessage } = useCarrito();
  const params = useParams();
  const categoriaNombre = params.categoria;

  const [productos, setProductos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cargaCompleta, setCargaCompleta] = useState(false);

  useEffect(() => {
    async function obtenerProductos() {
      try {
        const response = await axios.get(`categorias/categoria/${categoriaNombre}`);
        const productosConTalle = response.data.map((producto) => ({
          ...producto,
          tallesDisponibles: producto.talle.split(","),
          talleSeleccionado: ""
        }));
        setProductos(productosConTalle);
        setCargaCompleta(true);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setCargaCompleta(true); // Marcar la carga como completa incluso si hay un error
      }
    }

    obtenerProductos();
  }, [categoriaNombre]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalIsOpen(false);
  };

  useEffect(() => {
    if (loadingMessage) {
      showAlert(loadingMessage, "loading");
    }
  }, [loadingMessage]);

  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-custom alert-${type}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.classList.add("show");
    }, 10);

    setTimeout(() => {
      alertDiv.classList.remove("show");

      setTimeout(() => {
        alertDiv.remove();
      }, 310);
    }, 3000);
  }

  return (
    <>
      <div className="main-container">
        <div className="container mt-5">
          <h2 className="mb-4 text-white">{categoriaNombre} disponibles:</h2>
          {cargaCompleta ? (
            productos.length > 0 ? (
              <div className="row">
                {productos.map((producto) => (
                  <div key={producto.id_producto} className="col-md-4 mb-4">
                    <div className="card" onClick={() => openModal(producto)}>
                      <div className="card-img-container">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="img-fluid"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = notFound;
                          }}
                        />
                      </div>
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
                                Seleccionar talle
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
                              agregarAlCarrito(producto);
                              const nuevosProductos = productos.map((p) =>
                                p.id_producto === producto.id_producto
                                  ? { ...p, talleSeleccionado: "" }
                                  : p
                              );
                              setProductos(nuevosProductos);
                              showAlert("Producto agregado", "success");
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
              <div className="col-12 text-center text-white">
                Por el momento no hay productos disponibles en la categoría{" "}
                {categoriaNombre}.
              </div>
            )
          ) : (
            <Preload />
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

export default ProductosPorCategoria;
