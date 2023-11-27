import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCarrito } from "../../Context/CarritoContext";
import Carrusel from "./carrusel";
import CustomModal from "../../components/Inicio/CustomModal";
import Preload from "../../components/Preload/index";

function Inicio() {
  const { agregarAlCarrito } = useCarrito();
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [categoriaNombre, setCategoriaNombre] = useState("Todos los productos");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = window.innerWidth <= 768 ? 10 : 15;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cargaCompleta, setCargaCompleta] = useState(false); // Nuevo estado

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setProductos([]);
    setCargaCompleta(false); // Reiniciar cargaCompleta al cambiar la categoría
  }, [id]);

  useEffect(() => {
    async function obtenerProductos() {
      try {
        const response = await axios.get(
          `productos?limit=${limit}&offset=${offset}`
        );

        const productosConTalle = response.data.map((producto) => ({
          ...producto,
          tallesDisponibles: producto.talle.split(","),
          talleSeleccionado: ""
        }));

        if (response.data.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setProductos((prevProductos) => [
          ...prevProductos,
          ...productosConTalle
        ]);

        if (response.data[0]) {
          setCategoriaNombre(response.data[0].nombre_categoria);
        } else {
          setCategoriaNombre("Sin productos");
        }

        setCargaCompleta(true); // Establecer cargaCompleta después de obtener los productos
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    }

    obtenerProductos();
  }, [id, offset]);

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
      <Carrusel />
      {cargaCompleta ? (
        <div className="container mt-5">
          <h2 className="mb-4 text-white text-center">
            {categoriaNombre} Disponibles:
          </h2>
          <div className="row">
            {productos.map((producto) => (
              <div key={producto.id_producto} className="col-md-4 mb-4">
                <div className="card" onClick={() => openModal(producto)}>
                  <div className="card-img-container">
                    <img src={producto.imagen} alt={producto.nombre} />
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
      ) : (
        <Preload />
      )}
      <CustomModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        product={selectedProduct}
      />
    </>
  );
}

export default Inicio;
