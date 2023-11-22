import React from 'react';
import PendienteImage from '../../assets/pendiente.jpg';
import '../../css/checkout.css';

const PagoPendiente = () => {
  return (
    <div className="estado-pago-container pendiente">
      <img src={PendienteImage} alt="Pago Pendiente" className="banner-image" />
      <div className="content-container">
        <h2 className="titulo-pendiente">Pago Pendiente</h2>
        <p className="mensaje pendiente">Tu pago está pendiente de confirmación. Te notificaremos una vez se procese.</p>
      </div>
    </div>
  );
};

export default PagoPendiente;
