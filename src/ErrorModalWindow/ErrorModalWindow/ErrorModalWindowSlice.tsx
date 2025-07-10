//@ts-nocheck

import {  createSlice } from '@reduxjs/toolkit'

const ErrorModalWindowSlice = createSlice({
    name: 'ErrorModalWindowSlice',
    initialState: {
        data: [],
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

export const { ShowErrorModal,HideErrorModal } = ErrorModalWindowSlice.actions
export default ErrorModalWindowSlice.reducer