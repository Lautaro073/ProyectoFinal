import React, { useState } from 'react';
import axios from 'axios';

function Checkout() {
    const [formaEntrega, setFormaEntrega] = useState('retiro'); // Opción por defecto

    const handleCheckout = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const checkoutData = {
            nombreCompleto: formData.get('nombreCompleto'),
            direccion: formaEntrega === 'envio' ? formData.get('direccionEnvio') : 'Local', // Si es envío, toma la dirección; si es retiro, pon "Local"
            telefono: formData.get('numeroTelefono'),
            email: formData.get('correoElectronico'),
            carritoId: localStorage.getItem('carritoId'),
            formaEntrega: formaEntrega // Agrega la forma de entrega al objeto checkoutData
        };

        try {
            const response = await axios.post('checkout', checkoutData);
            if (response.status === 200) {
                alert('Compra realizada con éxito!');
                localStorage.removeItem('carritoId');
            }
        } catch (error) {
            alert('Ocurrió un error al realizar la compra. Por favor intenta nuevamente.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Realizar Compra</h2>
            <form onSubmit={handleCheckout}>
                <div className="mb-3">
                    <label htmlFor="nombreCompleto" className="form-label">Nombre completo</label>
                    <input type="text" className="form-control" id="nombreCompleto" name="nombreCompleto" placeholder="Nombre completo" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="formaEntrega" className="form-label">Forma de entrega</label>
                    <select className="form-control" id="formaEntrega" name="formaEntrega" onChange={(e) => setFormaEntrega(e.target.value)} required>
                        <option value="retiro">Retiro en local</option>
                        <option value="envio">Envío a domicilio</option>
                    </select>
                </div>
                {formaEntrega === 'envio' && (
                    <div className="mb-3">
                        <label htmlFor="direccionEnvio" className="form-label">Dirección de envío</label>
                        <input type="text" className="form-control" id="direccionEnvio" name="direccionEnvio" placeholder="Dirección de envío" required />
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="numeroTelefono" className="form-label">Número de teléfono</label>
                    <input type="text" className="form-control" id="numeroTelefono" name="numeroTelefono" placeholder="Número de teléfono" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="correoElectronico" className="form-label">Correo electrónico para confirmación</label>
                    <input type="email" className="form-control" id="correoElectronico" name="correoElectronico" placeholder="Correo electrónico para confirmación" required />
                </div>
                <button type="submit" className="btn btn-primary">Realizar Compra</button>
            </form>
        </div>
    );
}

export default Checkout;
