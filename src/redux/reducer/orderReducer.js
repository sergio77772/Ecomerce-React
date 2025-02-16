
const initialState = {
  Orders: [],
  pages:[],
  total:[],
  offset:[]

}

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, 
        Orders: action.payload.orders,
        pages: action.payload.total_pages,
        total:action.payload.total_orders,
        offset:action.payload.current_page
      }
    default:
      return state
  }
}

export default ordersReducer
