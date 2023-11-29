import React from "react";
import PendienteImage from "../../assets/pendiente.jpg";
import "../../css/checkout.css";

const PagoPendiente = () => {
  return (
    <div className="pagos">
      <div className="estado-pago-container pendiente" id="pendiente">
        <img
          src={PendienteImage}
          alt="Pago Pendiente"
          className="banner-image"
        />
        <div className="content-container">
          <h2 className="titulo-pendiente">Pago Pendiente</h2>
          <p className="mensaje pendiente">
            Le informamos que su pago se encuentra actualmente pendiente. En
            caso de que reciba la confirmación de aprobación, le solicitamos
            que lo notifique <a href="">aquí</a> y nos envíe el correspondiente
            comprobante. Muchas gracias!!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PagoPendiente;
