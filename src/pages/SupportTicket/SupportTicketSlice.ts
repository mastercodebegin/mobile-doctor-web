import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pageSize } from "../../helper/ApplicationConstants";
import { getRequestMethodWithParam, postRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

const storeData = localStorage.getItem('support-ticket')

const initialState = {
    isLoading: false,
    isSuccess: false,
    SupportTicketData: storeData ? JSON.parse(storeData) : []
}

const SupportTicketSlice = createSlice({
    name: 'SupportTicketSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder
        .addCase(GetAllSupportTicket.pending, (state, action) =>{
            state.isLoading = true
            state.isSuccess = false
            console.log("All Support Ticet Data is Pending :--", action.payload)
        })
        .addCase(GetAllSupportTicket.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.SupportTicketData = action.payload.content
        })
        .addCase(GetAllSupportTicket.rejected, (state, action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("All Support Ticket Data is Reject With Error :--", action.payload)
        })

// Fetch By Ticket Number
 .addCase(GetAllSupportTicketByTicketNumber.pending, (state, action) =>{
            state.isLoading = true
            state.isSuccess = false
            console.log("All Support Ticet By Ticket Number Data is Pending :--", action.payload)
        })
        .addCase(GetAllSupportTicketByTicketNumber.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.SupportTicketData = action.payload.content
        })
        .addCase(GetAllSupportTicketByTicketNumber.rejected, (state, action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("All Support Ticket By Ticket Number Data is Reject With Error :--", action.payload)
        })

        // Create Support Ticket
        .addCase(AddsupportTicket.pending, (state, action) =>{
            state.isLoading = true
            state.isSuccess = false
            console.log("Support Ticket Data Creating is Pending ....", action.payload)
        })
        .addCase(AddsupportTicket.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.SupportTicketData = [...state.SupportTicketData, action.payload]
        })
        .addCase(AddsupportTicket.rejected, (state, action) =>{
            state.isLoading = false
            state.isSuccess = false 
            console.log("Support Ticket Data Creating is Failed With :----", action.payload)
        })
    }
})


export default SupportTicketSlice.reducer

// Fetch All Support Ticket
export const GetAllSupportTicket = createAsyncThunk("FETCH/ALL/SUPPORT-TICKET", async (_, thunkAPI) =>{
    try {
        const param = {
            pageSize,
            pageNumber: 0
        }
        const response = await getRequestMethodWithParam(param, UrlConstants.GET_ALL_SUPPORT_TICKET);
        console.log("Response Data :--", response);
        return response;
    } catch (error: any) {
            const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})

// Fetch All Support Ticket By Ticket-Number
export const GetAllSupportTicketByTicketNumber = createAsyncThunk("FETCH/ALL/SUPPORT-TICKET/BY/TICKET-NUMBER", async (ticketNumber, thunkAPI) =>{
    try {
        const param = {
            pageSize,
            pageNumber: 0,
            ticketNumber,
        }
        const response = await getRequestMethodWithParam(param, UrlConstants.GET_ALL_SUPPORT_TICKET);
        console.log("Response Data :--", response);
        return response;
    } catch (error: any) {
            const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})

// Create Support Ticket
export const AddsupportTicket = createAsyncThunk("ADD/SUPPORT-TICKET", async (requestData: any, thunkAPI) =>{
    try {
        const response = await postRequestMethod(requestData, UrlConstants);
        console.log("Response Data :--", response);
        return response;
    } catch (error: any) {
             const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})