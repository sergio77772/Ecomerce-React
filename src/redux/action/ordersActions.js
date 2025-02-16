export const getOrders = (id_user) => async (dispatch) => {
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
          totalOrders: data.total_orders,
          totalPages: data.total_pages,
          currentPage: data.current_page,
        }
      });
      return { success: true };
    } else {
      console.error("Formato de respuesta inválido:", data);
      return { success: false, message: "Formato de respuesta inválido" };
    }
  } catch (error) {
    console.error("Error obteniendo órdenes:", error);
    dispatch({ type: 'USER_LOGIN_FAILURE', payload: error.message || 'Error de conexión' });
    return { success: false, message: error.message || 'Error de conexión' };
  }
};
