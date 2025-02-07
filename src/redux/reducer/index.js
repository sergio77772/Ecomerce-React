import handleCart from './handleCart'
import comercioReducer from "./comercioReducer";
import userReducer from "./userReducer"; // Importar el nuevo reducer

import { combineReducers } from "redux";
const rootReducers = combineReducers({
    handleCart,
    comercio: comercioReducer,
    user: userReducer, 
})
export default rootReducers