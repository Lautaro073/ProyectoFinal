const express = require("express");
const db = require("../database"); // Asumiendo que ya tienes una conexión a tu base de datos configurada
const sendEmail = require("./email");
const router = express.Router();

router.post("/", async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    telefono,
    correo,
    direccion,
    ciudad,
    provincia,
    codigo_postal,
    referenciaDeEntrega,
  } = req.body;

  // Aquí manejas el proceso de checkout, incluyendo la inserción en la base de datos.

  try {
    // Crear una nueva entrada en la tabla checkout.
    const query =
      "INSERT INTO checkout (nombre, apellido, dni, telefono, correo, direccion, ciudad, provincia, codigo_postal, referenciaDeEntrega) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      nombre,
      apellido,
      dni,
      telefono,
      correo,
      direccion,
      ciudad,
      provincia,
      codigo_postal,
      referenciaDeEntrega,
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows > 0) {
      // Ahora enviamos el correo electrónico después de un checkout exitoso
      const email ="lautarojimenez02@gmail.com"
      await sendEmail({
        to: email,
        from: "lautarojimenezads@gmail.com",
        subject: "Confirmación de tu pedido",
        templateId: "d-55ac57a8f24e4f2492ff53c304b8cbde",
        dynamicTemplateData: {
          nombre_cliente: nombre,
          apellido_cliente: apellido,
          dni_cliente: dni,
          correo_cliente: correo,
          telefono_cliente: telefono,
          direccion_cliente: direccion,
          ciudad_cliente: ciudad,
          provincia_cliente: provincia,
          codigo_postal_cliente: codigo_postal,
          referenciaDeEntrega_cliente: referenciaDeEntrega,
        },
      });

      res
        .status(200)
        .json({ message: "Checkout realizado con éxito y correo enviado." });
    } else {
      throw new Error("El proceso de checkout no pudo ser completado.");
    }
  } catch (error) {
    console.error("Error al procesar el checkout:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

module.exports = router;
