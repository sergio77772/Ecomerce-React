const initialState = {
  orders: [],
  totalPages: 0,
  totalOrders: 0,
  currentPage: 1,
  orderDetails: {},  // Debe ser un objeto en lugar de un array
  error: null,
  loading: false
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORDERS_REQUEST':
      return { ...state, loading: true, error: null };
      
    case 'SET_ORDERS':
      return { 
        ...state, 
        orders: action.payload.orders,
        totalPages: action.payload.totalPages, // Se corrige la nomenclatura
        totalOrders: action.payload.totalOrders,
        currentPage: action.payload.currentPage,
        loading: false
      };

    case 'GET_ORDERS_FAIL':
      return { ...state, error: action.payload, loading: false };

    case 'GET_ORDER_DETAILS_REQUEST':
      return { ...state, loading: true };

    case 'GET_ORDER_DETAILS_SUCCESS':
      return { ...state, orderDetails: action.payload, loading: false };

    case 'GET_ORDER_DETAILS_FAIL':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export default ordersReducer;
