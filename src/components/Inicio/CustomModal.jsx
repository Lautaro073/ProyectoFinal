import React, { useState } from "react";
import Modal from "react-modal";
import "../../css/CustomModal.css";
import { useCarrito } from "../../Context/CarritoContext";

const CustomModal = ({ isOpen, closeModal, product }) => {
  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-custom alert-${type}`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    // Dar un pequeño tiempo para que la alerta inicialice y luego agregar la clase 'show'
    setTimeout(() => {
      alertDiv.classList.add("show");
    }, 10);

    // Después de 3 segundos, remover la alerta
    setTimeout(() => {
      alertDiv.classList.remove("show");
      // Esperamos que termine la transición de salida y luego eliminamos el elemento del DOM
      setTimeout(() => {
        alertDiv.remove();
      }, 310); // 10 ms adicionales para asegurarnos de que la transición ha terminado
    }, 3000);
  }

  const [talleSeleccionado, setTalleSeleccionado] = useState("");
  const { agregarAlCarrito } = useCarrito(); // Añade esto
  const handleAgregarAlCarrito = () => {
    if (product && talleSeleccionado) {
      agregarAlCarrito({ ...product, talleSeleccionado }, 1);
      closeModal();
    } else {
      showAlert(
        "Por favor, selecciona un talle antes de agregar al carrito.",
        "error"
      );
    }
  };

  const handleTalleChange = (e) => {
    setTalleSeleccionado(e.target.value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="Modal"
      overlayClassName="Overlay"
      contentLabel="Detalles del Producto"
    >
      <div className="ModalContent">
        <div className="ModalCloseButton" onClick={closeModal}>
          <div className="CloseIcon">X</div>
        </div>
        <div className="ModalImageContainer">
          <img
            src={product ? product.imagen : ""}
            alt={product ? product.nombre : ""}
          />
        </div>
        <h2>{product ? product.nombre : ""}</h2>
        <p>Precio: {product ? `${product.precio}$` : ""}</p>
        <p>{product ? product.descripcion : ""}</p>
        <div className="form-group select-container">
          <select
            id={`talleSelect-${product ? product.id_producto : ""}`}
            className="form-control"
            onClick={(e) => e.stopPropagation()}
            onChange={handleTalleChange}
            value={talleSeleccionado}
          >
            <option value="" disabled>
              Seleccionar talle
            </option>
            {product &&
              product.tallesDisponibles.map((talle) => (
                <option key={talle} value={talle}>
                  {talle}
                </option>
              ))}
          </select>
        </div>
        <button
          className="ModalAddToCartButton"
          onClick={handleAgregarAlCarrito}
        >
          Añadir al Carrito
        </button>
      </div>
    </Modal>
  );
};

export default CustomModal;
