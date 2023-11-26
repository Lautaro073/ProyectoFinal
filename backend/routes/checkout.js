const express = require('express');
const db = require('../database'); // Asumiendo que ya tienes una conexión a tu base de datos configurada

const router = express.Router();

router.post('/', async (req, res) => {
    const {
        nombre, apellido, dni, telefono, correo,
        direccion, ciudad, provincia, codigo_postal, referenciaDeEntrega
    } = req.body;

    // Aquí manejas el proceso de checkout, incluyendo la inserción en la base de datos.

    try {
        // Crear una nueva entrada en la tabla checkout.
        const query = 'INSERT INTO checkout (nombre, apellido, dni, telefono, correo, direccion, ciudad, provincia, codigo_postal, referenciaDeEntrega) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [nombre, apellido, dni, telefono, correo, direccion, ciudad, provincia, codigo_postal, referenciaDeEntrega];
        
        const [result] = await db.query(query, values);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Checkout realizado con éxito." });
        } else {
            throw new Error('El proceso de checkout no pudo ser completado.');
        }
    } catch (error) {
        console.error("Error al procesar el checkout:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

module.exports = router;
