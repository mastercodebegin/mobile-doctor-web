import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethodWithParam } from "../../util/CommonService";
import { pageSize } from "../../helper/ApplicationConstants";
import { UrlConstants } from "../../util/practice/UrlConstants";

const storeData = localStorage.getItem('orders')

const initialState = {
    isLoading: false,
    isSuccess: false,
    Orders: storeData ? JSON.parse(storeData) : [],
}

const OrderSlice = createSlice({
    name: 'OrderSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder
         // Fetch By Id
                .addCase(GetAllRepairUnitOrderByUserId.pending, (state, action) =>{
                    state.isLoading = true
                    state.isSuccess = false
                    console.log("Data Fetching Pending ----", action.payload)
                })
                .addCase(GetAllRepairUnitOrderByUserId.fulfilled, (state, action) =>{
                    state.isLoading = false
                    state.isSuccess = true
                    state.Orders = action.payload
                })
                .addCase(GetAllRepairUnitOrderByUserId.rejected, (state, action) =>{
                    state.isLoading = false
                    state.isSuccess = false
                    console.log("All Repair Unit Order By User Id Data Fetching Failed :--", action.payload)
                })

                // Fetch By Status
                .addCase(GetAllRepairUnitOrderByStatus.pending, (state, action) =>{
                    state.isLoading = true
                    state.isSuccess = false
                    console.log("Data Fetching Pending ----", action.payload)
                })
                .addCase(GetAllRepairUnitOrderByStatus.fulfilled, (state, action) =>{
                    state.isLoading = false
                    state.isSuccess = true
                    state.Orders = action.payload
                })
                .addCase(GetAllRepairUnitOrderByStatus.rejected, (state, action) =>{
                    state.isLoading = false
                    state.isSuccess = false
                    console.log("All Repair Unit Order By User Id Data Fetching Failed :--", action.payload)
                })

                // Fetch By Date
                                .addCase(GetAllRepairUnitOrderByDate.pending, (state, action) =>{
                    state.isLoading = true
                    state.isSuccess = false
                    console.log("Data Fetching Pending ----", action.payload)
                })
                .addCase(GetAllRepairUnitOrderByDate.fulfilled, (state, action) =>{
                    state.isLoading = false
                    state.isSuccess = true
                    state.Orders = action.payload
                })
                .addCase(GetAllRepairUnitOrderByDate.rejected, (state, action) =>{
                    state.isLoading = false
                    state.isSuccess = false
                    console.log("All Repair Unit Order By User Id Data Fetching Failed :--", action.payload)
                })
    }
})


export default OrderSlice.reducer

// Fetch All Repair Unit Order By User Id
export const GetAllRepairUnitOrderByUserId = createAsyncThunk("FETCH/ALL/REPAIR/UNIT/ORDER/BY/USER/ID", async (_, thunkAPI) =>{
    try {
        const param = {
            pageSize,
            pageNumber: 0
        }
     
        const response = await getRequestMethodWithParam(param, UrlConstants.GET_ALL_REPAIR_UNIT_ORDER_BY_USER_ID);
        console.log("Response Data To Fetch All Repair Unit Order By User Id :---", response);
        return response;
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})

// Fetch All Repair Unit Order By Status
export const GetAllRepairUnitOrderByStatus = createAsyncThunk("FETCH/ALL/REPAIR/UNIT/ORDER/BY/STATUS", async (status: string, thunkAPI) =>{
    try {
        const param = {
            pageSize,
            pageNumber: 0,
            status
        }
        console.log(param)
        const response = await getRequestMethodWithParam(param, UrlConstants.GET_ALL_REPAIR_UNIT_ORDER_BY_USER_ID);
        console.log("Response Data To Fetch All Repair Unit Order By User Id :---", response);
        return response;
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})

// Fetch All Repair Unit ORder By Date
export const GetAllRepairUnitOrderByDate = createAsyncThunk("FETCH/ALL/REPAIR/UNIT/ORDER/BY/DATE", async (date: string, thunkAPI) =>{
    try {
        const response = await getRequestMethodWithParam(date, UrlConstants.GET_ALL_REPAIR_UNIT_ORDER_BY_USER_ID);
        console.log("Response Data To Fetch All Repair Unit Order By User Id :---", response);
        return response;
    } catch (error: any) {
         const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})