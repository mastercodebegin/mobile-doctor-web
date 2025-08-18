import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequestMethod } from "../../util/CommonService";
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
                    state.Orders = action.payload?.content
                })
                .addCase(GetAllRepairUnitOrderByUserId.rejected, (state, action) =>{
                    state.isLoading = false
                    state.isSuccess = false
                    console.log("All Repair Unit Order By User Id Data Fetching Failed :--", action.payload)
                })          
    }
})


export default OrderSlice.reducer

// Fetch All Repair Unit Order By User Id
export const GetAllRepairUnitOrderByUserId = createAsyncThunk("FETCH/ALL/REPAIR/UNIT/ORDER/BY/USER/ID", async (data:any, thunkAPI) =>{
    try {
       
     
        const response = await postRequestMethod(data, UrlConstants.GET_ALL_REPAIR_UNIT_ORDER_BY_USER_ID);
        console.log("Response Data To Fetch All Repair Unit Order By User Id :---", response);
        return response;
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})


// // Fetch User by Emali
// export const GetUserByEmail = createAsyncThunk("FETCH/USER/BY/EMAIL", async (data:string, thunkAPI) =>{
//     try {
//         const
//     } catch (error: any) {
//           const message = error?.response?.data?.message || error.message
//     return thunkAPI.rejectWithValue(message)
//     }
// })