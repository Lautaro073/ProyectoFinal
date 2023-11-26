const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const dotenv = require('dotenv');

//.env
dotenv.config()

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

router.post('/', (req, res) => {
    let preference = {
      items: [
        {
          title: req.body.title,
          quantity: req.body.quantity,
          currency_id: 'ARS',
          unit_price: req.body.price
        }
      ],
      back_urls: {
        success: 'http://localhost:3001/checkout',
        failure: 'http://localhost:3001/checkout/error',
        pending: 'http://localhost:3001/checkout/pendiente',
      },
      auto_return: 'approved',
    };
  
  
    mercadopago.preferences.create(preference)
      .then(response => {
        res.send(response.body.init_point);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error al crear la preferencia');
      });
  });
  module.exports = router;