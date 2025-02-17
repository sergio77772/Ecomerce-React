export const getOrders = (id_user) => async (dispatch) => {
  dispatch({ type: 'GET_ORDERS_REQUEST' }); // Indicamos que la carga inicia
  
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API}ordenes.php?action=ordenes_usuario&user_id=${id_user}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (Array.isArray(data.orders)) {
      dispatch({ 
        type: 'SET_ORDERS', 
        payload: {
          orders: data.orders,
          totalOrders: data.total_orders,  // Se mantiene coherencia con el reducer
          totalPages: data.total_pages,
          currentPage: data.current_page,
        }
      });
      return { success: true };
    } else {
      console.error("Formato de respuesta inválido:", data);
      dispatch({ type: 'GET_ORDERS_FAIL', payload: "Formato de respuesta inválido" });
      return { success: false, message: "Formato de respuesta inválido" };
    }
  } catch (error) {
    console.error("Error obteniendo órdenes:", error);
    dispatch({ type: 'GET_ORDERS_FAIL', payload: error.message || 'Error de conexión' });
    return { success: false, message: error.message || 'Error de conexión' };
  }
};

export const getOrderById = (orderId) => async (dispatch) => {
  dispatch({ type: 'GET_ORDER_DETAILS_REQUEST' }); // Indicamos que comienza la carga
  
  try {
    const response = await fetch(`${process.env.REACT_APP_API}ordenes.php?action=obtener_orden&id=${orderId}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    dispatch({ type: 'GET_ORDER_DETAILS_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'GET_ORDER_DETAILS_FAIL', payload: error.message });
  }
};
