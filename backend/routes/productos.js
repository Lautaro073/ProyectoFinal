const express = require('express');
const db = require('../database');
const path = require('path');
// Importar el módulo 'fs' para leer archivos
const fs = require('fs').promises;
const router = express.Router();
const verifyAdmin = require('../middlewares/middlewares');

router.get('/:id/stock', async (req, res) => {
    const productoId = req.params.id;


    try {
        const [rows] = await db.query("SELECT stock FROM Productos WHERE id_producto = ?", [productoId]);
        if (rows.length > 0) {
            res.json({ stock: rows[0].stock });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error fetching stock:", error);
        res.status(500).json({ error: "Error fetching stock" });
    }
});

// Obtener todos los productos con imagen
router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 15;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    try {
        const [rows] = await db.query(`
            SELECT Productos.*, Imagenes.mime, Imagenes.contenido 
            FROM Productos 
            LEFT JOIN Imagenes ON Productos.id_imagen = Imagenes.id 
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        const productosConImagen = rows.map(row => {
            return {
                ...row,
                imagen: row.contenido ? `data:${row.mime};base64,${Buffer.from(row.contenido).toString('base64')}` : null
            };
        });

        res.json(productosConImagen);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});

// obtener todos los productos sin restricciones
router.get('/all', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Productos');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener todos los productos');
    }
});
// Búsqueda de productos por término, incluyendo imágenes
router.get('/search', async (req, res) => {
    const searchTerm = req.query.search;
    if (!searchTerm) {
        return res.status(400).json({ error: "Debe proporcionar un término de búsqueda." });
    }
    try {
        const [rows] = await db.query(`
            SELECT Productos.*, Imagenes.mime, Imagenes.contenido 
            FROM Productos 
            LEFT JOIN Imagenes ON Productos.id_imagen = Imagenes.id 
            WHERE Productos.nombre LIKE ?
        `, [`%${searchTerm}%`]);

        const productosConImagen = rows.map(row => {
            return {
                ...row,
                imagen: row.contenido ? `data:${row.mime};base64,${Buffer.from(row.contenido).toString('base64')}` : null
            };
        });

        res.json(productosConImagen);
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        res.status(500).send('Error al buscar los productos');
    }
});



// Obtener un producto por ID con imagen
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT Productos.*, Imagenes.mime, Imagenes.contenido 
            FROM Productos 
            LEFT JOIN Imagenes ON Productos.id_imagen = Imagenes.id 
            WHERE Productos.id_producto = ?
        `, [req.params.id]);

        if (rows.length > 0) {
            const producto = {
                ...rows[0],
                imagen: rows[0].contenido ? `data:${rows[0].mime};base64,${Buffer.from(rows[0].contenido).toString('base64')}` : null
            };
            res.json(producto);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el producto');
    }
});



// Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        // Datos del producto
        const { nombre, descripcion, precio, id_categoria, stock, talle } = req.body;

        if (!req.files || !req.files.imagen) {
            return res.status(400).send('No se subió el archivo de imagen.');
        }

        let uploadedFile = req.files.imagen;
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimetype = fileTypes.test(uploadedFile.mimetype);

        if (!mimetype) {
            return res.status(400).send('Formato de archivo no permitido.');
        }

        // Convertir la imagen a un buffer
        const imageBuffer = uploadedFile.data;
        const imageName = uploadedFile.name;
        const imageMime = uploadedFile.mimetype;

        // Insertar la imagen en la tabla de imágenes
        const [imageResult] = await db.query('INSERT INTO Imagenes (contenido, mime, nombre) VALUES (?, ?, ?)', [imageBuffer, imageMime, imageName]);
        const imageId = imageResult.insertId;

        // Insertar datos del producto en la tabla de productos
        await db.query('INSERT INTO Productos (nombre, descripcion, precio, id_categoria, stock, talle, id_imagen) VALUES (?, ?, ?, ?, ?, ?, ?)', [nombre, descripcion, precio, id_categoria, stock, talle, imageId]);

        res.status(201).send('Producto agregado correctamente');
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).send('Error al agregar el producto');
    }
});



// Actualizar un producto
router.put('/:id', verifyAdmin, async (req, res) => {
    try {
        const { nombre, descripcion, precio, id_categoria, stock, talle } = req.body;
        const productoId = req.params.id;

        // Obtener el id de la imagen actual del producto
        const [currentProduct] = await db.query('SELECT id_imagen FROM Productos WHERE id_producto = ?', [productoId]);
        const currentImageId = currentProduct[0].id_imagen;

        if (req.files && req.files.imagen) {
            let uploadedFile = req.files.imagen;
            const fileTypes = /jpeg|jpg|png|gif/;
            const mimetype = fileTypes.test(uploadedFile.mimetype);

            if (!mimetype) {
                return res.status(400).send('Formato de archivo no permitido.');
            }

            // Convertir la imagen a un buffer
            const imageBuffer = uploadedFile.data;
            const imageName = uploadedFile.name;
            const imageMime = uploadedFile.mimetype;

            // Actualizar la imagen en la base de datos
            await db.query('UPDATE Imagenes SET contenido = ?, mime = ?, nombre = ? WHERE id = ?', [imageBuffer, imageMime, imageName, currentImageId]);
        }

        // Actualizar los datos del producto
        await db.query('UPDATE Productos SET nombre = ?, descripcion = ?, precio = ?, id_categoria = ?, stock = ?, talle = ? WHERE id_producto = ?', [nombre, descripcion, precio, id_categoria, stock, talle, productoId]);

        res.send('Producto actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send('Error al actualizar el producto');
    }
});




// Eliminar un producto
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        const productoId = req.params.id;

        // Obtener el id de la imagen asociada con el producto
        const [productData] = await db.query('SELECT id_imagen FROM Productos WHERE id_producto = ?', [productoId]);
        const imageId = productData[0].id_imagen;

        // Eliminar el producto
        await db.query('DELETE FROM Productos WHERE id_producto = ?', [productoId]);

        // Eliminar la imagen asociada
        await db.query('DELETE FROM Imagenes WHERE id = ?', [imageId]);

        res.send('Producto eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).send('Error al eliminar el producto');
    }
});


module.exports = router;
