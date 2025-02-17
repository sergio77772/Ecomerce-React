import React, { useState, useEffect } from 'react';
import { Footer, Navbar } from '../components';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { saveCartToAPI } from '../redux/action';

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const usuario = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [pais, setPais] = useState('');
  const [estado, setEstado] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || '');
      setEmail(usuario.correo || '');
      setDireccion(usuario.direccion || '');
    }
  }, [usuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      userId: usuario.id,
      productos: state.map((item) => ({
        product_id: item.idproducto,
        cantidad: item.qty
      }))
    };

    try {
      await dispatch(saveCartToAPI(orderData.productos, orderData.userId));
      setLoading(false);
      navigate('/mis-pedidos'); // Redirigir a la página de pedidos
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      setLoading(false);
    }
  };

  const EmptyCart = () => (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5">No hay productos en el carrito</h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );

  const ShowCheckout = () => {
    let subtotal = state.reduce((acc, item) => acc + item.precioventa * item.qty, 0);
    let shipping = 30.0;
    let totalItems = state.reduce((acc, item) => acc + item.qty, 0);

    return (
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
                    Productos ({totalItems}) <span>${Math.round(subtotal)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    Envío <span>${shipping}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <strong>Total</strong> <span><strong>${Math.round(subtotal + shipping)}</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-7 col-lg-8">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h4 className="mb-0">Dirección de Envío</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-sm-6 my-1">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>

                    <div className="col-12 my-1">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="col-12 my-1">
                      <label className="form-label">Dirección</label>
                      <input type="text" className="form-control" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                    </div>

                    <div className="col-md-5 my-1">
                      <label className="form-label">País</label>
                      <select className="form-select" value={pais} onChange={(e) => setPais(e.target.value)} required>
                        <option value="">Elegir...</option>
                        <option>Argentina</option>
                        <option>Bolivia</option>
                        <option>Paraguay</option>
                        <option>Uruguay</option>
                        <option>Chile</option>
                        <option>Brasil</option>
                      </select>
                    </div>

                    <div className="col-md-4 my-1">
                      <label className="form-label">Estado</label>
                      <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)} required>
                        <option value="">Elegir...</option>
                        <option>Perico</option>
                        <option>San Salvador de Jujuy</option>
                        <option>Carmen</option>
                      </select>
                    </div>

                    <div className="col-md-3 my-1">
                      <label className="form-label">Código Postal</label>
                      <input type="number" className="form-control" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} required />
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* Botón con spinner de carga */}
                  <button className="w-100 btn btn-primary d-flex align-items-center justify-content-center" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Guardando pedido...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-phone me-2"></i> Quiero que me contacten
                      </>
                    )}
                  </button>

                  <button className="w-100 btn btn-secondary d-flex align-items-center justify-content-center mt-3" disabled>
                    <i className="fa fa-credit-card me-2"></i> Pagar con MercadoPago
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
  );
};

export default Checkout;
