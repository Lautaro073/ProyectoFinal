const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');

const dotenv = require('dotenv');

//.env
dotenv.config()



// Importaciones de tus rutas
const productoRoutes = require('./routes/productos');
const ordenes = require('./routes/ordenes');
const userRoutes = require('./routes/users');
const carritoRoutes = require('./routes/carrito');
const checkoutRouter = require('./routes/checkout');
const sessionRoutes = require('./routes/session');
const categoriaRoutes = require('./routes/categorias');

const path = require('path');

const app = express();

// Comprueba y crea el directorio para imágenes si no existe
const dirPath = 'public/assets/imgProductos';
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath, { recursive: true });
}

app.use('/assets/imgProductos', express.static(path.join(__dirname, 'public/assets/imgProductos')));

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

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
});