import React from 'react';
import Modal from 'react-modal';
import '../../css/CustomModal.css';

const CustomModal = ({ isOpen, closeModal, product, agregarAlCarrito }) => {
  const handleAgregarAlCarrito = (e) => {
    e.stopPropagation(); // Evita que el clic en el botón propague al contenedor y abra el modal.
    if (product) {
      agregarAlCarrito(product.id_producto, 1);
      closeModal();
    }
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
        <p>Talles: {product ? product.talles : ''}</p>
        <p>{product ? product.descripcion : ''}</p>
        <button className="ModalAddToCartButton" onClick={handleAgregarAlCarrito}>
          Agregar al Carrito
        </button>
      </div>
    </Modal>
  );
};

export default CustomModal;
