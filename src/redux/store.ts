import {configureStore} from '@reduxjs/toolkit'
// import thunkMiddleware from 'redux-thunk';
import RootReducer from './RootReducer';
// import { createLogger } from "redux-logger";

// const logger = createLogger();



export const Store=configureStore({
    // reducer:DashBoardSlice 
    // reducer:{...RootReducer}
    reducer:RootReducer,
    devTools: true,
    // middleware: [thunkMiddleware],


    
})
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch; // extra line in claudi