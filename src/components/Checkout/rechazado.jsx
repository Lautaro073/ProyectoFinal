import React from 'react';
import RechazadoImage from '../../assets/rechazado.jpg';
import '../../css/checkout.css'; 

const PagoRechazado = () => {
  return (
    <div className="estado-pago-container rechazado">
      <img src={RechazadoImage} alt="Pago Rechazado" className="banner-image" />
      <div className="content-container">
        <h2 className="titulo-rechazado">Pago Rechazado</h2>
        <p className="mensaje rechazado">Tu pago ha sido rechazado. Por favor, verifica la información e intenta nuevamente.</p>
      </div>
    </div>
  );
};

export default PagoRechazado;