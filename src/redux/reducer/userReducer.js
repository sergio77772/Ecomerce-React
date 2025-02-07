const initialState = {
    user: JSON.parse(localStorage.getItem("userData")) || null, // Recuperar usuario si existe
    loading: false,
    error: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case "USER_LOGIN_REQUEST":
        return { ...state, loading: true, error: null };
  
      case "USER_LOGIN_SUCCESS":
        console.log(action.payload)
        return { ...state, loading: false, user: action.payload };
  
      case "USER_LOGIN_FAILURE":
        return { ...state, loading: false, error: action.payload };
  
      case "USER_LOGOUT":
        return { ...state, user: null };
  
      default:
        return state;
    }
  };
  
  export default userReducer;
  