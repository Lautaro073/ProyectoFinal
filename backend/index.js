const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const mercadopago = require('mercadopago');
const dotenv = require('dotenv');
// test_user_1975908777@testuser.com
//.env
dotenv.config()

mercadopago.configure({
    access_token: 'process.env.MERCADOPAGO_ACCESS_TOKEN'
  });

// Importaciones de tus rutas
const productoRoutes = require('./routes/productos');
const ordenes = require('./routes/ordenes');
const userRoutes = require('./routes/users');
const carritoRoutes = require('./routes/carrito');
const checkoutRouter = require('./routes/checkout');
const sessionRoutes = require('./routes/session');
const categoriaRoutes = require('./routes/categorias');
const mp =require('./routes/mp')
const path = require('path');

const app = express();


// Configuraciones y middlewares
app.use(morgan('dev')); 
app.use('/public', express.static('public')); 
app.use(cors({ origin: '*' }));
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static('public/assets'));


// Rutas
app.use('/api', userRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ordenes',  ordenes); // Cambiado para mantener consistencia
app.use('/api/carrito', carritoRoutes);
app.use('/api/checkout', checkoutRouter); 
app.use('/api/session', sessionRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/create_preference', mp)
// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
});