const initialState = {
  comercio: [],
}

const comercioReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COMERCIO':
      return { ...state, comercio: action.payload }
    default:
      return state
  }
}

export default comercioReducer
