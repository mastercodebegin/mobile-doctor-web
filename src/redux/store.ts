// import {configureStore} from "@reduxjs/toolkit"
// // import AuthReducer from "../features/auth/AuthSlice"
// import RootReducer from "./RootReducer";
// // import ErrorModalWindowSlice from "../ErrorModalWindow/ErrorModalWindow/ErrorModalWindowSlice";

// export const Store = configureStore({
// reducer : RootReducer
// // {
// // Auth : AuthReducer
// // }
// })


// export type RootState = ReturnType<typeof Store.getState>;
// export type AppDispatch = typeof Store.dispatch;





import {configureStore} from '@reduxjs/toolkit'
// import thunkMiddleware from 'redux-thunk';
import RootReducer from './RootReducer';
// import { createLogger } from "redux-logger";

// const logger = createLogger();



export const Store=configureStore({
    // reducer:DashBoardSlice 
    // reducer:{...RootReducer}
    devTools: true,
    reducer:RootReducer,
    // middleware: [thunkMiddleware],


    
})
export type RootState = ReturnType<typeof Store.getState>;