import React from 'react'
import { Footer, Navbar } from "../components";
const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Sobre nosotros</h1>
        <hr />
        <p className="lead text-center">
        ¡BIENVENIDO/A A DISTRIBUIDORA ASSEF PERICO!

Inicio como un pequeño emprendimiento familiar de cerrajería domiciliaria en el barrio perico, hace más de 25 años. Gracias al conocimiento y la experiencia adquirida decidimos dedicarnos a abastecer el mercado local.


Nuestro objetivo es brindarles la mejor atención, para lograr establecer lazos duraderos basados en la confianza y la satisfacción. Para ello contamos con un equipo de trabajo joven, dinámico y utilizamos las nuevas tecnologías para realizar el proceso de compra más fácil y efectivo.


Somos pioneros en el desarrollo de Plataformas Digitales para el uso exclusivo del gremio de cerrajeros. Nuestro sistema es práctico y seguro.

Todos nuestros productos tienen garantía, y nos preocupamos por brindarte la mejor atención.


¡Esperemos que este sea el inicio de una linda amistad!


MISIÓN: Ofrecer, al mayor número de clientes, artículos de cerrajería con altos estándares de calidad a precios competitivos.
        </p>

        <h2 className="text-center py-4">Nuestros Produtos</h2>

        <div className="row">
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Herrajes</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Ferreteria</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Deposito</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Logistica</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage