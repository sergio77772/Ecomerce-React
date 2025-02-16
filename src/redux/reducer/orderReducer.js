const initialState = {
  orders: [],
  totalPages: 0,
  totalOrders: 0,
  currentPage: 1
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ORDERS':
      console.log("Datos recibidos en el reducer:", action.payload);
      return { 
        ...state, 
        orders: action.payload.orders,
        totalPages: action.payload.total_pages,
        totalOrders: action.payload.total_orders,
        currentPage: action.payload.current_page
      };
      
    default:
      return state;
  }
};

export default ordersReducer;
