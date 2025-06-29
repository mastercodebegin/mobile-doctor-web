//@ts-nocheck

import {  createSlice } from '@reduxjs/toolkit'


//Action


const ErrorModalWindowSlice = createSlice({
    name: 'ErrorModalWindowSlice',
    initialState: {
        data: [1,2,3,4,5],
        isLoading: false,
        isErrorModalWindow:false,
        message:'you have an error'
    },
    reducers: {
        ShowErrorModal: (state,action) => {
            console.log('msg=====',action);
            
            state.isErrorModalWindow = true
            state.message=action.payload
        },
        HideErrorModal: (state,action) => {
            state.isErrorModalWindow = false
        },
    },



})

export default ErrorModalWindowSlice.reducer
export const { ShowErrorModal,HideErrorModal } = ErrorModalWindowSlice.actions