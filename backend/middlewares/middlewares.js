const jwt = require('jsonwebtoken');

function verifyAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Normalmente el token viene como "Bearer <token>", por lo que lo dividimos y tomamos la segunda parte
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).send('Token no proporcionado.');

    jwt.verify(token, 'yourSecretKey', (err, decoded) => {
        if (err) return res.status(500).send('Error al autenticar el token.');
        
        // Verifica si el rol es de administrador
        if (decoded.rol !== 'admin') return res.status(403).send('No autorizado.');

        next(); // Si todo está bien, pasa al siguiente middleware o ruta
    });
}

module.exports = verifyAdmin;
