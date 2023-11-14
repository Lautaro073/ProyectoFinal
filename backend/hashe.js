const bcrypt = require('bcryptjs');

const password = "pesa"; // Cambia "tuContraseña" por la contraseña real que quieras usar
const hashedPassword = bcrypt.hashSync(password, 10); // El 10 es el número de "salt rounds", puedes ajustarlo si lo deseas

console.log(hashedPassword);