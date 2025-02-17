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
      const exist = state.find((x) => x.idproducto === product.idproducto)
      if (exist) {
        updatedCart = state.map((x) =>
          x.idproducto === product.idproducto ? { ...x, qty: x.qty + 1 } : x
        )
      } else {
        updatedCart = [...state, { ...product, qty: 1 }]
      }
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
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return updatedCart

    case 'CLEARCART':
      localStorage.removeItem('cart') // Limpia localStorage
      return [] // Retorna un array vacío para limpiar el carrito

    default:
      return state
  }
}

export default handleCart
