import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, getRequestMethodWithParam } from "../../util/CommonService";
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

interface ProductVisitResponse {
  responseDetails: {
    period: string;
    count: number;
  }[];
}

interface DashboardState {
  isLoading: boolean;
  isSuccess: boolean;
  dashboardData: DashboardResponse | null;
  productVisitData: ProductVisitResponse | null;
}

const initialState: DashboardState = {
    isLoading: false,
    isSuccess: false,
    dashboardData: storedData ? JSON.parse(storedData) : [],
    productVisitData: storedData ? JSON.parse(storedData) : [
  { period: 'Tue', count: 75 },
  { period: 'Wed', count: 50 },
  { period: 'Thu', count: 65 },
  { period: 'Fri', count: 80 },
  { period: 'Sat', count: 90 },
  { period: 'Sun', count: 85 },
    ]
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

          .addCase(GetAllOrdersInGraph.pending, (state, acction) =>{
            state.isLoading = true
            state.isSuccess = false
            console.log("Order Praph is Pending :---", acction.payload)
        })
        .addCase(GetAllOrdersInGraph.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.productVisitData = action.payload.responseDetails
        })
        .addCase(GetAllOrdersInGraph.rejected, (state, action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("Failed To Fetch All Order-Graph :--", action.payload)
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

// Fetch Order Data in Daily/Weekly/Monthly/yearly Thunk
export const GetAllOrdersInGraph = createAsyncThunk("FETCH/ALL/ORDERS/IN/GRAPH", async (data:string, thunkAPI) =>{
    try {
        const param = {
            period: data
        }
        const response = await getRequestMethodWithParam(param, UrlConstants.GET_ALL_ORDERS_IN_GRAPH);
        console.log("Response Data :----", response);
        return response
    } catch (error: any) {
         const message = error?.response?.data?.message || error.message || "Failed to fetch Order-Count";
      return thunkAPI.rejectWithValue(message);
    }
})