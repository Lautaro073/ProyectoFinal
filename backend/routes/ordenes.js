const express = require('express');
const db = require('../database');

const router = express.Router();

router.post('/crearOrden', async (req, res) => {
    try {
        const { productos, informacionEnvio } = req.body;
        // Guarda la orden en la base de datos.
        res.status(201).send('Orden creada exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear la orden');
    }
});

module.exports = router;

// Crear orden
router.post('/:id_user', async (req, res) => {
    try {
        const fecha = new Date();
        const [result] = await db.query('INSERT INTO ordenes (id_user, fecha) VALUES (?, ?)', [req.params.id_user, fecha]);
        const id_orden = result.insertId;

        const items = req.body.items; // Debe ser un array con {id_producto, cantidad, precio_unitario}
        for (let item of items) {
            await db.query('INSERT INTO detalles_orden (id_orden, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', [id_orden, item.id_producto, item.cantidad, item.precio_unitario]);
        }

        res.status(201).send(`Orden creada con ID: ${id_orden}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear la orden');
    }
});

// Obtener órdenes de un usuario
router.get('/:id_user', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ordenes WHERE id_user = ?', [req.params.id_user]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las órdenes del usuario');
    }
});

// Obtener detalles de una orden
router.get('/detalles/:id_orden', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM detalles_orden WHERE id_orden = ?', [req.params.id_orden]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los detalles de la orden');
    }
});

module.exports = router;
