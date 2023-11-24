import React from "react";
import "../../css/Preload.css";
const Preload = () => {
  return (
    <div>
      <div className="preload">
        <div className="preloader">
          <div className="preloader__text">
            <p className="preloader__msg">Cargando productos...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preload;
