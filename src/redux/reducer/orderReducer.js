const initialState = {
  Orders: [],
}

const OrdersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, comercio: action.payload }
    default:
      return state
  }
}

export default OrdersReducer
