import React, { useState } from 'react';
import axios from 'axios';

const PaymentButton = ({ title, quantity, price }) => {
  const [paymentUrl, setPaymentUrl] = useState('');

  const handlePayment = () => {
    axios.post('/crearpago', { title, quantity, price })
      .then(response => {
        setPaymentUrl(response.data);
      })
      .catch(error => {
        console.log('Error al crear la preferencia', error);
      });
  };
  return (
    <div>
      {paymentUrl ? (
        <a href={paymentUrl} target="_blank" rel="noopener noreferrer">Pagar con Mercado Pago</a>
      ) : (
        <button className="btn btn-success" onClick={handlePayment}>Proceder al Pago - Total: ${}</button>
      )}
    </div>
  );
};

export default PaymentButton;
