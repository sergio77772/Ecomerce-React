// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}


export const setComercio = (comercio) => ({
    type: "SET_COMERCIO",
    payload: comercio,
  });
  
  export const fetchComercio = () => {
    const API = process.env.REACT_APP_API + "comercio.php";

    return async (dispatch) => {
      try {
        const response = await fetch(API);
        const data = await response.json();
        if (data.length > 0) {
          dispatch(setComercio(data[0])); // Guardamos solo el primer comercio
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
  };