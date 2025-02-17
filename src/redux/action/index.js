// Acción para agregar un producto al carrito
export const addCart = (product) => ({
  type: 'ADDITEM',
  payload: product,
});

// Acción para eliminar un producto del carrito
export const delCart = (product) => ({
  type: 'DELITEM',
  payload: product,
});

// Acción para vaciar el carrito después de realizar la compra
export const clearCart = () => ({
  type: 'CLEARCART',
});

// Acción asincrónica para guardar el carrito en la API
export const saveCartToAPI = (cart, userId) => async (dispatch) => {
  const API = process.env.REACT_APP_API;
  
  try {
    const response = await fetch(`${API}ordenes.php?action=guardar_orden`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, productos: cart }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Error al guardar el carrito');

    console.log('Carrito guardado exitosamente', data);
    
    
    // Vaciar el carrito después de una compra exitosa
    dispatch(clearCart());
    
    return data;
  } catch (error) {
    console.error('Error al enviar el carrito:', error);
  }
};

// Acción para establecer datos del comercio en el estado global
export const setComercio = (comercio) => ({
  type: 'SET_COMERCIO',
  payload: comercio,
});

// Acción asincrónica para obtener los datos del comercio
export const fetchComercio = () => async (dispatch) => {
  const API = `${process.env.REACT_APP_API}comercio.php`;

  try {
    const response = await fetch(API);
    const data = await response.json();

    if (data.length > 0) {
      dispatch(setComercio(data[0])); // Guardamos solo el primer comercio
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
};
