import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../../css/nav.css";
import logo from "../../assets/logo.png";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchResults from "./SearchResults";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function NavbarPrincipal() {
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [totalCarrito, setTotalCarrito] = useState(0);

  const obtenerUserIdActual = () => {
    return localStorage.getItem("sessionId"); // Corregir el nombre a "sessionId"
  };

  const [userId, setUserId] = useState(obtenerUserIdActual());
  console.log("UserID:", userId);
  const actualizarCarrito = async (userId) => {
    try {
      const response = await axios.get(
        `carrito/${userId}`
      );
      const productos = response.data;
      const cantidad = productos.length;
      let total = 0;
      productos.forEach((item) => {
        total += item.precio * item.cantidad;
      });
      setCantidadProductos(cantidad);
      setTotalCarrito(total);
    } catch (error) {
      console.error("Error al obtener el carrito", error);
    }
  };

  useEffect(() => {
    const userId = obtenerUserIdActual();
    if (userId) {
      actualizarCarrito(userId);
    }
  }, []);
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUserId = obtenerUserIdActual();
      if (updatedUserId !== userId) {
        setUserId(updatedUserId);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    if (userId) {
      axios
        .get(`carrito/${userId}`)
        .then((response) => {
          console.log("Respuesta del servidor:", response.data);
          const productos = response.data;
          const cantidad = productos.length;
          let total = 0;
          productos.forEach((item) => {
            total += item.precio * item.cantidad;
          });
          const userId = obtenerUserIdActual();
          if (userId) {
            actualizarCarrito(userId);
          }
          setCantidadProductos(cantidad);
          setTotalCarrito(total);
        })
        .catch((error) => {
          console.error("Error al obtener el carrito", error);
        });
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userId]);

  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState([]); // Definición del estado productos
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/buscar?search=${search}`;
    axios
      .get(`productos/search?search=${search}`)
      .then((response) => {
        setProductos(response.data); // Actualización del estado productos
        setShowResults(true); // Mostrar los resultados
      })
      .catch((error) => {
        console.error("Error en la búsqueda:", error);
      });
  };

  return (
    <section className="header-main bg-black">
      <div className="container-fluid">
        <div className="row p-2 pt-3 pb-3 d-flex align-items-center">
          <div className="col-4 col-md-2">
            <Link to="/inicio" className="nav-link logo">
              <img
                src={logo}
                className="img-fluid d-flex"
                width="125"
                alt="Logo"
              />
            </Link>
          </div>
          <div className="col-8 col-md-8">
            <form onSubmit={handleSearch} className="d-flex form-inputs">
              <input
                className="form-control"
                type="text"
                placeholder="Busca tu Producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn" type="submit">
                <i className="bx bx-search text-black"></i>
              </button>
            </form>
          </div>
          <div className="col-12 col-md-2 link">
            <div className="d-flex flex-column flex-md-row align-items-center">
              <div className="carrito-desktop">
                <Link to="/carrito" className="nav-link">
                  <span className="shop-bag">
                    <i className="bx bxs-shopping-bag"></i>
                  </span>
                </Link>
                <Link to="/carrito" className="nav-link">
                  <div className="d-flex flex-column ms-2">
                    <span className="qty">{cantidadProductos} Productos</span>
                    <span className="fw-bold">${totalCarrito}</span>
                  </div>
                </Link>
              </div>
              <button
                className="btn-carrito "
                onClick={() => (window.location.href = "/carrito")}
              >
                <i className="bx bxs-shopping-bag"></i> 
              </button>
            </div>
          </div>
        </div>
      </div>
      {showResults && <SearchResults productos={productos} />}
    </section>
  );
}

function NavbarCategorias({ children }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function obtenerCategorias() {
      try {
        const response = await axios.get(
          "categorias"
        );
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    }

    obtenerCategorias();
  }, []);

  return (
    <>
    <Navbar className="navbar navbar-dark bg-black custom-navbar" expand="lg">
    <Navbar.Brand>Categorias</Navbar.Brand>
    <Navbar.Toggle bg="dark" aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        {categorias.map((categoria) => (
          <Nav.Link className="text-white" key={categoria.id_categoria} href={`/categoria/${categoria.nombre_categoria.toLowerCase()}`}>{categoria.nombre_categoria}</Nav.Link>
        ))}
      </Nav>
    </Navbar.Collapse>
  </Navbar>
      {children}
    </>
  );
}

export default function Navegacion() {
  return (
    <>
      <NavbarPrincipal />
      <NavbarCategorias />
    </>
  );
}
