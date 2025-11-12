import {configureStore} from '@reduxjs/toolkit'
import RootReducer from './RootReducer';
// import { createLogger } from "redux-logger";

// const logger = createLogger();



export const Store=configureStore({
    reducer:RootReducer,
    devTools: true,


    
})
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch; 