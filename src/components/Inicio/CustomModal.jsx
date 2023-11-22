import React, { useState } from 'react';
import Modal from 'react-modal';
import '../../css/CustomModal.css';

const CustomModal = ({ isOpen, closeModal, product, agregarAlCarrito }) => {
  const [talleSeleccionado, setTalleSeleccionado] = useState('');

  const handleAgregarAlCarrito = (e) => {
    if (product && talleSeleccionado) {
      agregarAlCarrito(product.id_producto, 1);
      closeModal();
    } else {
      alert('Por favor, selecciona un talle antes de agregar al carrito.');
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
          <img src={product ? product.imagen : ''} alt={product ? product.nombre : ''} />
        </div>
        <h2>{product ? product.nombre : ''}</h2>
        <p>Precio: {product ? `${product.precio}$` : ''}</p>
        <p>{product ? product.descripcion : ''}</p>
        <div className="form-group select-container">
          <select
            id={`talleSelect-${product ? product.id_producto : ''}`}
            className="form-control"
            onClick={(e) => e.stopPropagation()}
            onChange={handleTalleChange}
            value={talleSeleccionado}
          >
            <option value="" disabled>
              Seleccionar talle
            </option>
            {product && product.tallesDisponibles.map((talle) => (
              <option key={talle} value={talle}>
                {talle}
              </option>
            ))}
          </select>
        </div>
        <button className="ModalAddToCartButton" onClick={handleAgregarAlCarrito}>
          Añadir al Carrito
        </button>
      </div>
    </Modal>
  );
};

export default CustomModal;
