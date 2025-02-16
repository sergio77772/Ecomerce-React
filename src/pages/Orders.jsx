import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Footer } from '../components';
import { getOrders } from '../redux/action/ordersActions'; // Acción para obtener órdenes

function Orders() {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.user.user);
  const orders = useSelector((state) => state.orders.orders) || []; // 🔹 Accedemos correctamente a orders

  console.log("Órdenes obtenidas:", orders);

  useEffect(() => {
    if (usuario) {
      dispatch(getOrders(usuario.id));
    }
  }, [usuario, dispatch]);

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">Mis Órdenes</h2>

        {orders.length === 0 ? (
          <p className="text-center">No tienes órdenes registradas.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.usuario || 'Desconocido'}</td>
                    <td>{order.estado || 'Sin estado'}</td>
                    <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Fecha no disponible'}</td>
                    <td>
                      <button className="btn btn-primary btn-sm">
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Orders;
