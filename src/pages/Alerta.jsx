// Alerta.js
function Alerta({ mensaje, tipo }) {
    return (
      <div className={`alerta alerta-${tipo}`}>
        {mensaje}
      </div>
    );
  }
  
  export default Alerta;
  