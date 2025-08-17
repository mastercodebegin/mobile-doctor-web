import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

const storedData = localStorage.getItem("dashboard")

interface ResponseDetails {
  total: number;
  READY_TO_PICK: number;
  PENDING: number;
}

interface DashboardResponse {
  responseDetails: ResponseDetails;
  message: string | null;
  jwtToken: string | null;
  picturePath: string | null;
  statusCode: number | null;
  httpStatus: string | null;
}

interface DashboardState {
  isLoading: boolean;
  isSuccess: boolean;
  dashboardData: DashboardResponse | null;
}

const initialState: DashboardState = {
    isLoading: false,
    isSuccess: false,
    dashboardData: storedData ? JSON.parse(storedData) : []
}

const DashboardSlice = createSlice({
    name: 'DashboardSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(GetAllOrderCount.pending, (state, acction) =>{
            state.isLoading = true
            state.isSuccess = false
            console.log("Order Count is Pending :---", acction.payload)
        })
        .addCase(GetAllOrderCount.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.dashboardData = action.payload
        })
        .addCase(GetAllOrderCount.rejected, (state, action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("Failed To Fetch All Order-Count :--", action.payload)
        })
    }
})


export default DashboardSlice.reducer

// Fetch Card Data Thunk
export const GetAllOrderCount = createAsyncThunk("FETHC/ALL/ORDER-COUNT", async (_, thunkAPI) =>{
    try {
        const response = await getRequestMethod(UrlConstants.GET_ALL_ORDER_COUNT);
        console.log("Response Data :---", response);
        return response
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message || "Failed to fetch Order-Count";
      return thunkAPI.rejectWithValue(message);
    }
})