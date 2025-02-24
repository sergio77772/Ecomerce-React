export const loginUser = (userData) => async (dispatch) => {
  dispatch({ type: 'USER_LOGIN_REQUEST' })

  try {
    // Simulación de autenticación con API
    const response = await fetch(
      process.env.REACT_APP_API + 'users.php?action=login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }
    )

    const data = await response.json()

    if (data.success) {
      localStorage.setItem('token', data.token) // Guardar token
      localStorage.setItem('userData', JSON.stringify(data))
      localStorage.setItem('user', JSON.stringify(data.nombre))

      dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data })
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

export const editUser = (userData) => async (dispatch) => {
  console.log(userData)
  try {
    const response = await fetch(
      process.env.REACT_APP_API + 'publicUser.php?action=edit',
      {
        method: 'POST',
        body: userData,
      }
    )

    const data = await response.json()
    if (data.success) {
      localStorage.setItem(
        'userData',
        JSON.stringify(Object.fromEntries(userData))
      )
      localStorage.setItem('user', JSON.stringify(userData.get('nombre')))

      dispatch({ type: 'USER_EDIT_SUCCESS', payload: userData })
      return { success: true }
    } else {
      dispatch({ type: 'USER_EDIT_FAILURE', payload: data.message })
      return { success: false, message: data.message }
    }
  } catch (error) {
    dispatch({ type: 'USER_EDIT_FAILURE', payload: 'Error' })
    return { success: false, message: 'Error de conexión' }
  }
}

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token')
  localStorage.removeItem('userData')
  localStorage.removeItem('user')

  dispatch({ type: 'USER_LOGOUT' })
}
