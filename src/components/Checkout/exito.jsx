import React from 'react';
import ExitoImage from '../../assets/exito.jpg';
import '../../css/checkout.css';

const PagoExitoso = () => {
    return (
      <div className="estado-pago-container exito">
        <img src={ExitoImage} alt="Pago Exitoso" className="banner-image" />
        <div className="content-container">
          <h2 className="titulo-exitoso">Pago Exitoso</h2>
          <p className="mensaje exito">¡Tu pago ha sido procesado con éxito! Gracias por tu compra.</p>
        </div>
      </div>
    );
  };
  
  export default PagoExitoso;
