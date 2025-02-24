import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          {/* 🔹 Navegación */}
          <div className="col-md-3">
            <h5 className="fw-bold">NAVEGACIÓN</h5>
            <ul className="list-unstyled">
              <li>Inicio</li>
              <li>Contacto</li>
            </ul>
          </div>

          {/* 🔹 Medios de Pago */}
          <div className="col-md-3">
            <h5 className="fw-bold">MEDIOS DE PAGO</h5>
            <div className="d-flex flex-wrap">
              <img src="/visa.png" alt="Visa" width="50" className="me-2 mb-2"/>
              <img src="/mastercard.png" alt="MasterCard" width="50" className="me-2 mb-2"/>
              <img src="/american-express.png" alt="American Express" width="50" className="me-2 mb-2"/>
            </div>

            <h5 className="fw-bold mt-3">FORMAS DE ENVÍO</h5>
            <div className="d-flex flex-wrap">
              <img src="/oca.png" alt="OCA" width="50" className="me-2 mb-2"/>
              <img src="/correo-argentino.png" alt="Correo Argentino" width="50" className="me-2 mb-2"/>
            </div>
          </div>

          {/* 🔹 Contacto */}
          <div className="col-md-3">
            <h5 className="fw-bold">CONTACTANOS</h5>
            <p>
              📞 3886018041 <br />
              📧 herrajessasef@gmail.com <br />
              📍 Av. 
            </p>
          </div>

          {/* 🔹 Redes Sociales & Newsletter */}
          <div className="col-md-3">
            <h5 className="fw-bold">REDES SOCIALES</h5>
            <div className="d-flex gap-2">
              <img src="/instagram.png" alt="Instagram" width="30"/>
              <img src="/facebook.png" alt="Facebook" width="30"/>
              <img src="/youtube.png" alt="YouTube" width="30"/>
              <img src="/pinterest.png" alt="Pinterest" width="30"/>
            </div>

            
          </div>
        </div>
      </div>
    </footer>
  );
}
