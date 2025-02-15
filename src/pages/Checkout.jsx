import React from 'react'
import { Footer, Navbar } from '../components'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
const Checkout = () => {
  const state = useSelector((state) => state.handleCart)

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const ShowCheckout = () => {
    let subtotal = 0
    let shipping = 30.0
    let totalItems = 0
    state.map((item) => {
      return (subtotal += item.price * item.qty)
    })

    state.map((item) => {
      return (totalItems += item.qty)
    })
    return (
      <>
        <div className="container py-5">
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Resumen del pedido</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})
                      <span>${Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Envío
                      <span>${shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Monto total</strong>
                      </div>
                      <span>
                        <strong>${Math.round(subtotal + shipping)}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Dirección de Envio</h4>
                </div>
                <div className="card-body">
                  <form className="needs-validation" novalidate>
                    <div className="row g-3">
                      <div className="col-sm-6 my-1">
                        <label for="firstName" className="form-label">
                          Nombre
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Se requiere un nombre válido.
                        </div>
                      </div>

                      <div className="col-sm-6 my-1">
                        <label for="lastName" className="form-label">
                          Apellido
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Se requiere un Apellido válido.
                        </div>
                      </div>

                      <div className="col-12 my-1">
                        <label for="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="nombre@example.com"
                          required
                        />
                        <div className="invalid-feedback">
                          Por favor ingrese una dirección de correo electrónico
                          válida para el envío actualizaciones.
                        </div>
                      </div>

                      <div className="col-12 my-1">
                        <label for="address" className="form-label">
                          Dirección
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Por favor ingrese su dirección de envío.
                        </div>
                      </div>

                      <div className="col-12">
                        <label for="address2" className="form-label">
                          Dirección 2{' '}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address2"
                          placeholder=""
                        />
                      </div>

                      <div className="col-md-5 my-1">
                        <label for="country" className="form-label">
                          País
                        </label>
                        <br />
                        <select className="form-select" id="country" required>
                          <option value="">Elegir...</option>
                          <option>Argentina</option>
                          <option>Bolivia</option>
                          <option>Paraguay</option>
                          <option>Uruguary</option>
                          <option>Chile</option>
                          <option>Brasil</option>
                        </select>
                        <div className="invalid-feedback">
                          Seleccione un país válido.
                        </div>
                      </div>

                      <div className="col-md-4 my-1">
                        <label for="state" className="form-label">
                          State
                        </label>
                        <br />
                        <select className="form-select" id="state" required>
                          <option value="">Elegir...</option>
                          <option>Perico</option>
                          <option>San Salvador de Jujuy</option>
                          <option>Carmen</option>
                        </select>
                        <div className="invalid-feedback">
                          Proporcione un estado válido.
                        </div>
                      </div>

                      <div className="col-md-3 my-1">
                        <label for="zip" className="form-label">
                          Código Postal
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="zip"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Se requiere código postal.
                        </div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <h4 className="mb-3">Pago</h4>

                    <div className="row gy-3">
                      <div className="col-md-6">
                        <label for="cc-name" className="form-label">
                          Nombre en la tarjeta
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-name"
                          placeholder=""
                          required
                        />
                        <small className="text-muted">
                          Nombre completo como se muestra en la tarjeta.
                        </small>
                        <div className="invalid-feedback">
                          Se requiere el nombre en la tarjeta
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label for="cc-number" className="form-label">
                          Número de Tarjeta de Crédito
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-number"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Se requiere número de tarjeta de crédito
                        </div>
                      </div>

                      <div className="col-md-3">
                        <label for="cc-expiration" className="form-label">
                          Vencimiento
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-expiration"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Fecha de vencimiento requerida
                        </div>
                      </div>

                      <div className="col-md-3">
                        <label for="cc-cvv" className="form-label">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-cvv"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Se requiere código de seguridad
                        </div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <button
                      className="w-100 btn btn-primary "
                      type="submit"
                      disabled
                    >
                      Continuar pagando
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Verificar</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  )
}

export default Checkout
