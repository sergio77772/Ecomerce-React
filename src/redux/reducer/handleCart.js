// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  const storedCart = localStorage.getItem('cart')
  return storedCart ? JSON.parse(storedCart) : []
}

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload
  let updatedCart

  switch (action.type) {
    case 'ADDITEM':
      // Check if product already in cart
      const exist = state.find((x) => x.idproducto === product.idproducto)
      if (exist) {
        // Increase the quantity  Si el producto existe, aumentar la cantidad
        updatedCart = state.map((x) =>
          x.idproducto === product.idproducto ? { ...x, qty: x.qty + 1 } : x
        )
      } else {
        // Si el producto no existe, agregarlo al carrito con una cantidad de 1
        updatedCart = [...state, { ...product, qty: 1 }]
      }
      // Update localStorage Actualizar localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return updatedCart

    case 'DELITEM':
      const exist2 = state.find((x) => x.idproducto === product.idproducto)
      if (exist2.qty === 1) {
        updatedCart = state.filter((x) => x.idproducto !== exist2.idproducto)
      } else {
        updatedCart = state.map((x) =>
          x.idproducto === product.idproducto ? { ...x, qty: x.qty - 1 } : x
        )
      }
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return updatedCart

    default:
      return state
  }
}

export default handleCart
