const express = require('express');
const db = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// POST /login
router.post('/login', async (req, res) => {
    try {
        const { user, password } = req.body;

        // Comprobar usuario
        const [users] = await db.query('SELECT * FROM users WHERE user = ?', [user]);
        if (users.length === 0) return res.status(400).send('Usuario no encontrado');

        const userRecord = users[0];
        
        // Verificar la contraseña
        const passwordValid = await bcrypt.compare(password, userRecord.password);
        if (!passwordValid) return res.status(400).send('Contraseña incorrecta');

        // Crear token
        const token = jwt.sign({ id: userRecord.id_user, rol: userRecord.rol }, 'yourSecretKey', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al iniciar sesión');
    }
});


module.exports = router;
