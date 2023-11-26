import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Checkout() {
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-custom alert-${type}`;
        alertDiv.textContent = message;
      
        document.body.appendChild(alertDiv);
      
        setTimeout(() => {
          alertDiv.classList.add('show');
        }, 10);
      
        setTimeout(() => {
          alertDiv.classList.remove('show');
      
          setTimeout(() => {
            alertDiv.remove();
          }, 310);
        }, 3000);
      }
    
    
    const [formaEntrega, setFormaEntrega] = useState('retiro');
    const navigate = useNavigate();
    const handleCheckout = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const checkoutData = {
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            dni: formData.get('dni'),
            telefono: formData.get('numeroTelefono'),
            correo: formData.get('correoElectronico'),
            direccion: formaEntrega === 'envio' ? formData.get('direccionEnvio') : 'Local',
            ciudad: formData.get('ciudad'),
            provincia: formData.get('provincia'),
            codigo_postal: formData.get('codigoPostal'),
            referenciaDeEntrega: formaEntrega,
            carritoId: localStorage.getItem('carritoId')
        };

        try {
            const response = await axios.post('checkout', checkoutData);
            if (response.status === 200) {
                showAlert('Compra realizada con éxito!', "success");
                navigate("/checkout/exito")
                localStorage.removeItem('carritoId');
            }
        } catch (error) {
            console.log(error)
            showAlert('Ocurrió un error al realizar la compra. Por favor intenta nuevamente.', 'error');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Realizar Compra</h2>
            <form onSubmit={handleCheckout}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre" name="nombre" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="apellido" className="form-label">Apellido</label>
                    <input type="text" className="form-control" id="apellido" name="apellido" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="dni" className="form-label">DNI</label>
                    <input type="text" className="form-control" id="dni" name="dni" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="numeroTelefono" className="form-label">Número de teléfono</label>
                    <input type="text" className="form-control" id="numeroTelefono" name="numeroTelefono" placeholder="Número de teléfono" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="correoElectronico" className="form-label">Correo electrónico para confirmación</label>
                    <input type="email" className="form-control" id="correoElectronico" name="correoElectronico" placeholder="Correo electrónico para confirmación" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="formaEntrega" className="form-label bg-black">Forma de entrega</label>
                    <select className="form-control" id="formaEntrega" name="formaEntrega" onChange={(e) => setFormaEntrega(e.target.value)} required>
                        <option className='bg-black' value="retiro">Retiro en local</option>
                        <option className='bg-black' value="envio">Envío a domicilio</option>
                    </select>
                </div>
                {formaEntrega === 'envio' && (
                    <div className="mb-3">
                        <label htmlFor="direccionEnvio" className="form-label">Dirección de envío</label>
                        <input type="text" className="form-control" id="direccionEnvio" name="direccionEnvio" placeholder="Dirección de envío" required />
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="ciudad" className="form-label">Ciudad</label>
                    <input type="text" className="form-control" id="ciudad" name="ciudad" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="provincia" className="form-label">Provincia</label>
                    <input type="text" className="form-control" id="provincia" name="provincia" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="codigoPostal" className="form-label">Código Postal</label>
                    <input type="text" className="form-control" id="codigoPostal" name="codigoPostal" required />
                </div>
                <button type="submit" className="btn btn-primary mb-4">Realizar Compra</button>
            </form>
        </div>
    );
}

export default Checkout;
