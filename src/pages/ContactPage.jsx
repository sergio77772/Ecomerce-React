import React from "react";
import { Footer, Navbar } from "../components";
const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
<<<<<<< HEAD
        <h1 className="text-center">Contáctenos</h1>
=======
        <h1 className="text-center">Contact Us</h1>
>>>>>>> ca18473fdc2a9e3f43b31a321f3f55f47bd163e1
        <hr />
        <div class="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form>
              <div class="form my-3">
<<<<<<< HEAD
                <label for="Name">Nombre</label>
=======
                <label for="Name">Name</label>
>>>>>>> ca18473fdc2a9e3f43b31a321f3f55f47bd163e1
                <input
                  type="email"
                  class="form-control"
                  id="Name"
<<<<<<< HEAD
                  placeholder="Ingresa tu nombre"
=======
                  placeholder="Enter your name"
>>>>>>> ca18473fdc2a9e3f43b31a321f3f55f47bd163e1
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
<<<<<<< HEAD
                <label for="Password">Mensaje</label>
=======
                <label for="Password">Message</label>
>>>>>>> ca18473fdc2a9e3f43b31a321f3f55f47bd163e1
                <textarea
                  rows={5}
                  class="form-control"
                  id="Password"
<<<<<<< HEAD
                  placeholder="Escribe tu mensaje"
=======
                  placeholder="Enter your message"
>>>>>>> ca18473fdc2a9e3f43b31a321f3f55f47bd163e1
                />
              </div>
              <div className="text-center">
                <button
                  class="my-2 px-4 mx-auto btn btn-dark"
                  type="submit"
                  disabled
                >
<<<<<<< HEAD
                  Enviar
=======
                  Send
>>>>>>> ca18473fdc2a9e3f43b31a321f3f55f47bd163e1
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
