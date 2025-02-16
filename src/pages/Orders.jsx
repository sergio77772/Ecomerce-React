import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navbar, Footer } from '../components';

function Orders() {
  const usuario = useSelector((state) => state.user.user); // Obtener usuario de Redux
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (usuario) {
      fetchOrders(usuario.id);
    }
  }, [usuario]);

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}ordenes.php?action=ordenes_usuario&user_id=${userId}`
      );
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        console.error('Error al obtener órdenes:', data.error);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

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
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.estado}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
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
