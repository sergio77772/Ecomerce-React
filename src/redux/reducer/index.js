import handleCart from './handleCart'
import comercioReducer from './comercioReducer'
import userReducer from './userReducer' 
import ordersReducer from './orderReducer'

import { combineReducers } from 'redux'
const rootReducers = combineReducers({
  handleCart,
  comercio: comercioReducer,
  user: userReducer,
  orders:ordersReducer,
})
export default rootReducers
