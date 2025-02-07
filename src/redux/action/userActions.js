export const loginUser = (userData) => async (dispatch) => {
    dispatch({ type: "USER_LOGIN_REQUEST" });
  
    try {
      // Simulación de autenticación con API
      const response = await fetch(process.env.REACT_APP_API + "users.php?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        localStorage.setItem("token", data.token); // Guardar token
        localStorage.setItem("userData", JSON.stringify(data));
        localStorage.setItem("user", JSON.stringify(data.nombre));


        dispatch({ type: "USER_LOGIN_SUCCESS", payload: data });
      } else {
        dispatch({ type: "USER_LOGIN_FAILURE", payload: data.message });
      }
    } catch (error) {
      dispatch({ type: "USER_LOGIN_FAILURE", payload: "Error de conexión" });
    }
  };
  
  export const logoutUser = () => (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("user");

    dispatch({ type: "USER_LOGOUT" });
  };
  