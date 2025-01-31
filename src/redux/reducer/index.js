import handleCart from './handleCart'
import comercioReducer from "./comercioReducer";
import { combineReducers } from "redux";
const rootReducers = combineReducers({
    handleCart,
    comercio: comercioReducer,
})
export default rootReducers