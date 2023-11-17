import React from "react";
import Carrusel from "../components/Inicio/carrusel";
import PageNotFoundImg from '../assets/page not found.png'; // Asegúrate de que la ruta es correcta

function PageNotFound() {
  return (
    <>
      <Carrusel />
      <div className="container mt-5">
        <div className="text-center">
          {/* La imagen es ahora responsiva con Bootstrap */}
          <img src={PageNotFoundImg} alt="Page Not Found" className="img-fluid" />
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
