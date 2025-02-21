import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Footer } from '../components';
import { getOrders } from '../redux/action/ordersActions';
import { useNavigate } from 'react-router-dom';
import SkeletonTable from '../components/skeleton/SkeletonTable'

function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const usuario = useSelector((state) => state.user.user);
  const orders = useSelector((state) => state.orders.orders) || [];
  const loading = useSelector((state) => state.orders.loading); // Agregamos el estado de carga

  useEffect(() => {
    if (usuario) {
      dispatch(getOrders(usuario.id));
    }
  }, [usuario, dispatch]);

  const handleViewDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">Mis Órdenes</h2>

        {loading ? (
          <SkeletonTable rows={9} columns={5} />
        ) : orders.length === 0 ? (
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
                      <button className="btn btn-primary btn-sm" onClick={() => handleViewDetails(order.id)}>
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
