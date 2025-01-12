import React from "react";
import { Footer, Navbar } from "../components";
const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Contáctenos</h1>

        <hr />
        
        <div className="row">
          <div className="col-md-12 item_contacto">
            <span className="glyphicon glyphicon-phone-alt" aria-hidden="true"></span> (0388) 4918813
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 item_contacto">
            <span className="glyphicon glyphicon-earphone" aria-hidden="true"></span> WhatsApp 388
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 item_contacto">
            <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span> info@distribuidoraassefperico.com.ar
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 item_contacto">
            <span className="glyphicon glyphicon-home" aria-hidden="true"></span> 25 de Mayo, Y4610 Perico, Jujuy, Argentina
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 item_contacto">
            <span className="glyphicon glyphicon-time" aria-hidden="true"></span> Lunes a Viernes de 8.30hs a 13hs y de 14hs a 18hs
          </div>
        </div>
      


        <div class="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form>
              <div class="form my-3">
                <label for="Name">Nombre</label>

                <input
                  type="email"
                  class="form-control"
                  id="Name"
                  placeholder="Ingresa tu nombre"

                />
              </div>
              <div class="form my-3">
                <label for="Email">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="Email"
                  placeholder="name@example.com"
                />
              </div>
              <div class="form  my-3">
                <label for="Password">Mensaje</label>

                <textarea
                  rows={5}
                  class="form-control"
                  id="Password"
                  placeholder="Escribe tu mensaje"
                />
              </div>
              <div className="text-center">
                <button
                  class="my-2 px-4 mx-auto btn btn-dark"
                  type="submit"
                  disabled
                >
                  Enviar

                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


      <div className="row my-4">
          <div className="col-md-12">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.8222691056975!2d-65.11583738496317!3d-24.381221784280792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc5b0dc8d44ad%3A0x1234567890abcdef!2sAv.%20Exodo%20205-265%2C%20Y4610%20Perico%2C%20Jujuy%2C%20Argentina!5e0!3m2!1ses!2sar!4v1234567890123"
              width="100%"
              height="450"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
          </div>
        </div>








      <Footer />
    </>
  );
};

export default ContactPage;
