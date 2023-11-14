const express = require("express");
const db = require("../database");

const router = express.Router();

// Obtener los productos de un carrito

router.get("/:id_carrito", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT items_carrito.cantidad, Productos.id_producto, Productos.nombre, Productos.precio, Productos.imagen 
            FROM items_carrito 
            JOIN Productos ON items_carrito.id_producto = Productos.id_producto 
            WHERE items_carrito.id_carrito = ?
        `, [req.params.id_carrito]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los items del carrito');
    }
});


// Agregar producto al carrito o actualizar cantidad si ya existe
router.post("/:id_carrito", async (req, res) => {
  try {
    const { id_producto, cantidad } = req.body;

    if (!id_producto || cantidad <= 0) {
      return res.status(400).send("Datos inválidos");
    }

    // Verificar si el producto ya existe en el carrito
    const [existingItems] = await db.query(
      "SELECT * FROM items_carrito WHERE id_carrito = ? AND id_producto = ?",
      [req.params.id_carrito, id_producto]
    );

    if (existingItems.length > 0) {
      // Si el producto ya existe en el carrito, actualizar la cantidad
      const newCantidad = existingItems[0].cantidad + cantidad;
      await db.query(
        "UPDATE items_carrito SET cantidad = ? WHERE id_carrito = ? AND id_producto = ?",
        [newCantidad, req.params.id_carrito, id_producto]
      );
      res.send("Cantidad del producto actualizada en el carrito");
    } else {
      // Si el producto no existe en el carrito, insertar nueva fila
      await db.query(
        "INSERT INTO items_carrito (id_carrito, id_producto, cantidad) VALUES (?, ?, ?)",
        [req.params.id_carrito, id_producto, cantidad]
      );
      res.status(201).send("Producto agregado al carrito");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error al agregar o actualizar el producto en el carrito");
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
// Obtener los productos de un carrito basado en UUID de usuario
router.get("/:user_uuid", async (req, res) => {
  try {
    // Verificar que el carrito con el UUID proporcionado existe
    const [carrito] = await db.query(
      `
        SELECT items_carrito.cantidad, Productos.id_producto, Productos.nombre, Productos.precio, Productos.imagen 
FROM items_carrito 
JOIN Productos ON items_carrito.id_producto = Productos.id_producto 
WHERE items_carrito.id_carrito = ?
`,
      [req.params.user_uuid]
    );
    if (carrito.length === 0) {
      return res.status(404).send("Carrito no encontrado");
    }

    // Obtener items del carrito asociado al UUID del usuario
    const [rows] = await db.query(
      `
            SELECT items_carrito.cantidad, Productos.nombre, Productos.precio 
            FROM items_carrito 
            JOIN Productos ON items_carrito.id_producto = Productos.id_producto 
            WHERE items_carrito.id_carrito = ?
        `,
      [req.params.user_uuid]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los items del carrito");
  }
});
module.exports = router;
