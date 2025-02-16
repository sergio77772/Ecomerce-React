export const getOrders = (id_user) => async (dispatch) => {
 // dispatch({ type: 'USER_LOGIN_REQUEST' })

  try {
    const response = await fetch(
      process.env.REACT_APP_API + 'ordenes.php?action=ordenes_usuario&user_id='+id_user,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
       
      }
    )

    const data = await response.json()

    if (data.success) {
     console.log(data)
      dispatch({ type: 'SET_ORDERS', payload: data })
      return { success: true }
    } else {
      dispatch({ type: 'USER_LOGIN_FAILURE', payload: data.message })
      return { success: false, message: data.message }
    }
  } catch (error) {
    dispatch({ type: 'USER_LOGIN_FAILURE', payload: 'Error de conexión' })
    return { success: false, message: 'Error de conexión' }
  }
}



