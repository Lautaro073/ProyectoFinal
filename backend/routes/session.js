const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const db = require("../database");

// Ruta para guardar el id_carrito en la base de datos
router.post("/guardar", async (req, res) => {
    const id_carrito = req.body.id_carrito;
  
    try {
      // Verificar si el id_carrito ya existe en la base de datos
      const [results] = await db.query(
        "SELECT COUNT(*) as count FROM Carrito WHERE id_carrito = ?",
        [id_carrito]
      );
  
      if (results[0].count > 0) {
        console.log("El id_carrito ya existe en la base de datos");
        res.status(409).send("El ID del carrito ya existe en la base de datos");
        return;
      }
  
      // Insertar el id_carrito en la base de datos
      await db.query("INSERT INTO Carrito (id_carrito) VALUES (?)", [id_carrito]);
      console.log("Insertado con éxito en Carrito:", id_carrito);
  
      res.status(201).send("ID del carrito guardado en la base de datos");
    } catch (error) {
      console.error("Error al insertar en la base de datos:", error);
      res.status(500).send("Error al guardar el ID del carrito: " + error.message);
    }
  });
  


router.get("/start-session", (req, res) => {
  const sessionId = uuidv4();
  console.log("Generando nuevo sessionId:", sessionId); // Generar un UUID único.
  res.json({ sessionId });
});
// Crear un carrito y retornar el id_carrito generado
router.post("/crear", async (req, res) => {
  try {
    const id_carrito = uuidv4();
    console.log("Insertando id_carrito en Carrito:", id_carrito);
    await db.query("INSERT INTO Carrito (id_carrito) VALUES (?)", [id_carrito]);
    console.log("Insertado con éxito en Carrito:", id_carrito);

    res.json({ id_carrito });
} catch (error) {
    console.error("Error al insertar en la base de datos:", error);
    res.status(500).send("Error al crear un nuevo carrito: " + error.message);
}
});
// Ruta para verificar si el id_carrito ya existe en la base de datos
router.get("verificar/:id_carrito", async (req, res) => {
  const id_carrito = req.params.id_carrito;

  try {
    const [results] = await db.query(
      "SELECT COUNT(*) as count FROM Carrito WHERE id_carrito = ?",
      [id_carrito]
    );

    // Si la cuenta es mayor que 0, significa que el id_carrito ya existe en la base de datos
    res.json({ exists: results[0].count > 0 });
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).send("Error al consultar la base de datos");
  }
});

module.exports = router;
