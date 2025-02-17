import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../redux/action/ordersActions';
import { Navbar, Footer } from '../components';

function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderDetails = useSelector((state) => state.orders.orderDetails);

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [id, dispatch]);

  if (!orderDetails) return <p className="text-center mt-5">Cargando...</p>;

  // Validar que productos sea un array antes de mapear
  const productos = Array.isArray(orderDetails.productos) ? orderDetails.productos : [];

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">Detalles de la Orden #{orderDetails.id}</h2>
        <div className="card p-4 shadow">
          <p><strong>Usuario:</strong> {orderDetails.user_id}</p>
          <p><strong>Estado:</strong> {orderDetails.estado}</p>
          <p><strong>Fecha:</strong> {new Date(orderDetails.created_at).toLocaleDateString()}</p>

          <h4 className="mt-4">Productos:</h4>
          <div className="table-responsive">
            {productos.length > 0 ? (
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>ID Producto</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => {
                    // Asegurar que precioventa sea un número válido
                    const precioUnitario = parseFloat(producto.precioventa) || 0;
                    const total = producto.cantidad * precioUnitario;

                    return (
                      <tr key={producto.product_id}>
                        <td>{producto.product_id}</td>
                        <td>{producto.producto}</td>
                        <td>{producto.cantidad}</td>
                        <td>${precioUnitario.toFixed(2)}</td>
                        <td>${total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No hay productos en esta orden.</p>
            )}
          </div>

          <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
            ⬅ Volver Atrás
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrderDetails;
