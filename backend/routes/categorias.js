const express = require('express');
const db = require('../database'); // Asumo que ya tienes una conexión a la base de datos configurada.

const router = express.Router();
// Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM Categorias');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las categorías');
    }
  });
  
// Obtener todas las categorías con sus productos
router.get('/con-productos', async (req, res) => {
    try {
        // Primero, obtenemos todas las categorías
        const [categorias] = await db.query('SELECT id_categoria, nombre_categoria FROM Categorias');

        // Ahora, por cada categoría, obtenemos sus productos
        for (let categoria of categorias) {
            const [productos] = await db.query('SELECT * FROM Productos WHERE id_categoria = ?', [categoria.id_categoria]);
            categoria.productos = productos;
        }

        res.json(categorias);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las categorías con productos');
    }
});


// Obtener una categoría específica por ID
router.get('/:id_categoria', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Categorias WHERE id_categoria = ?', [req.params.id_categoria]);
        if (rows.length === 0) {
            res.status(404).send('Categoría no encontrada');
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la categoría');
    }
});
// Obtener productos de una categoría específica por nombre de categoría
router.get('/categoria/:nombre_categoria', async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT p.* 
        FROM Productos p
        JOIN Categorias c ON p.id_categoria = c.id_categoria
        WHERE c.nombre_categoria =?`, 
            [req.params.nombre_categoria]
        );
        if (rows.length === 0) {
            res.status(404).send('No se encontraron productos para esta categoría');
        } else {
            res.json(rows);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos por categoría');
    }
});



// Agregar una nueva categoría
router.post('/', async (req, res) => {
    try {
        const { nombre_categoria } = req.body;
        await db.query('INSERT INTO Categorias (nombre_categoria) VALUES (?)', [nombre_categoria]);
        res.status(201).send('Categoría agregada correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar la categoría');
    }
});

// Actualizar una categoría
router.put('/:id_categoria', async (req, res) => {
    try {
        const { nombre_categoria } = req.body;
        await db.query('UPDATE Categorias SET nombre_categoria = ? WHERE id_categoria = ?', [nombre_categoria, req.params.id_categoria]);
        res.send('Categoría actualizada correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la categoría');
    }
});

// Eliminar una categoría
router.delete('/:id_categoria', async (req, res) => {
    try {
        await db.query('DELETE FROM Categorias WHERE id_categoria = ?', [req.params.id_categoria]);
        res.send('Categoría eliminada correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la categoría');
    }
});

module.exports = router;