const express = require("express");
const db = require("../database");

const router = express.Router();

// Obtener los productos de un carrito
router.get("/:id_carrito", async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT items_carrito.cantidad, items_carrito.talle, Productos.id_producto, Productos.nombre, Productos.precio, Imagenes.mime, Imagenes.contenido 
        FROM items_carrito 
        JOIN Productos ON items_carrito.id_producto = Productos.id_producto 
        LEFT JOIN Imagenes ON Productos.id_imagen = Imagenes.id
        WHERE items_carrito.id_carrito = ?
    `, [req.params.id_carrito]);

    const itemsConImagenYTalle = rows.map(row => {
        return {
            ...row,
            imagen: row.contenido ? `data:${row.mime};base64,${Buffer.from(row.contenido).toString('base64')}` : null,
            talle: row.talle  // Asegúrate de que el campo 'talle' se incluya correctamente en tu objeto de respuesta.
        };
    });

    res.json(itemsConImagenYTalle);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los items del carrito');
  }
});






// Agregar producto al carrito o actualizar cantidad si ya existe
router.post("/:id_carrito", async (req, res) => {
  try {
    const { id_producto, cantidad, talle } = req.body;

    // Verifica que id_producto, cantidad y talle estén presentes
    if (!id_producto || cantidad <= 0 || !talle) {
      return res.status(400).send("Datos inválidos");
    }

    // Verifica si el mismo producto con el mismo talle ya existe en el carrito
    const [existingItems] = await db.query(
      "SELECT * FROM items_carrito WHERE id_carrito = ? AND id_producto = ? AND talle = ?",
      [req.params.id_carrito, id_producto, talle]
    );

    if (existingItems.length > 0) {
      // Producto con el mismo talle ya existe, actualiza la cantidad
      const newCantidad = existingItems[0].cantidad + cantidad;
      await db.query(
        "UPDATE items_carrito SET cantidad = ? WHERE id_carrito = ? AND id_producto = ? AND talle = ?",
        [newCantidad, req.params.id_carrito, id_producto, talle]
      );
      res.send("Cantidad del producto actualizada en el carrito");
    } else {
      // Nuevo producto o mismo producto con diferente talle
      await db.query(
        "INSERT INTO items_carrito (id_carrito, id_producto, cantidad, talle) VALUES (?, ?, ?, ?)",
        [req.params.id_carrito, id_producto, cantidad, talle]
      );
      res.status(201).send("Producto agregado al carrito");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar o actualizar el producto en el carrito");
  }
});



// Actualizar cantidad de producto en el carrito
router.put("/:id_carrito/:id_producto", async (req, res) => {
  try {
    const { cantidad } = req.body;

    if (cantidad <= 0) {
      return res.status(400).send("Cantidad inválida");
    }

    await db.query(
      "UPDATE items_carrito SET cantidad = ? WHERE id_carrito = ? AND id_producto = ?",
      [cantidad, req.params.id_carrito, req.params.id_producto]
    );
    res.send("Producto actualizado en el carrito");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el producto en el carrito");
  }
});
// Actualizar cantidad de producto en el carrito considerando el talle
router.put("/:id_carrito/:id_producto/:talle", async (req, res) => {
  try {
    const { cantidad } = req.body;
    const { id_carrito, id_producto, talle } = req.params;

    if (cantidad <= 0) {
      return res.status(400).send("Cantidad inválida");
    }

    await db.query(
      "UPDATE items_carrito SET cantidad = ? WHERE id_carrito = ? AND id_producto = ? AND talle = ?",
      [cantidad, id_carrito, id_producto, talle]
    );
    res.send("Cantidad del producto actualizada en el carrito");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el producto en el carrito");
  }
});

// Eliminar producto del carrito
router.delete('/:id_carrito/:id_producto', async (req, res) => {
    try {
        await db.query('DELETE FROM items_carrito WHERE id_carrito = ? AND id_producto = ?', [req.params.id_carrito, req.params.id_producto]);
        res.send('Producto eliminado del carrito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el producto del carrito');
    }
});

// Eliminar producto específico del carrito basado en el talle
router.delete('/:id_carrito/:id_producto/:talle', async (req, res) => {
  try {
      const { id_carrito, id_producto, talle } = req.params;

      await db.query('DELETE FROM items_carrito WHERE id_carrito = ? AND id_producto = ? AND talle = ?', [id_carrito, id_producto, talle]);
      res.send('Producto eliminado del carrito');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el producto del carrito');
  }
});

// Obtener los productos de un carrito basado en UUID de usuario
router.get("/:user_uuid", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
        SELECT items_carrito.cantidad, Productos.nombre, Productos.precio, Productos.talle, Imagenes.contenido AS imagen 
        FROM items_carrito 
        JOIN Productos ON items_carrito.id_producto = Productos.id_producto 
        LEFT JOIN Imagenes ON Productos.id_imagen = Imagenes.id
        WHERE items_carrito.id_carrito = ?
      `,
      [req.params.user_uuid]
    );
    res.json(rows.map(row => {
        return {
            ...row,
            imagen: row.imagen ? `data:image/jpeg;base64,${Buffer.from(row.imagen).toString('base64')}` : null // Asumiendo que el MIME type es siempre JPEG
        };
    }));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los items del carrito");
  }
});


module.exports = router;
