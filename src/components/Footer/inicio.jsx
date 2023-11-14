import React from "react";
import "../../css/Footer.css";
function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="social-icons">
          <a
            href="https://www.facebook.com/profile.php?id=61551773941703&mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-square"></i>
          </a>
          <a
            href="https://instagram.com/siempre.bandidos?igshid=NTc4MTIwNjQ2YQ=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <p className="copyright-text">
          &copy; {new Date().getFullYear()} DevWeb. Todos
          los derechos reservados.
        </p>
      </footer>
    </>
  );
}

export default Footer;
