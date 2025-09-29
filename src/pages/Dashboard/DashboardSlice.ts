import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, getRequestMethodWithParam, postRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.DASHBAORD);

interface OrdersCounts {
  total: number;
  READY_TO_PICK: number;
  PENDING: number;
  CANCELLED: number;
  COMPLETED: number;
  PICKED_UP_BY_PARTNER: number;
  PICKED_UP_BY_USER: number;
  IN_SERVICE: number;
  READY_TO_DISPATCH: number;
  DISPATCHED: number;
  DELIVERED: number;
}

interface UserCountsByRole {
manager: number;
admin: number;
customer: number
}

interface ResponseDetails {
ordersCounts: OrdersCounts;
userCountsByRole: UserCountsByRole;
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
    dashboardData: storeData,
    productVisitData: storeData ? storeData : [
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
            state.dashboardData = action?.payload
            LocalStorageManager.saveData(STORAGE_KEYS.DASHBAORD, action.payload);
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
            LocalStorageManager.saveData(STORAGE_KEYS.DASHBAORD, action.payload);
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
export const GetAllOrderCount = createAsyncThunk("FETHC/ALL/ORDER-COUNT", async (requestData: any, thunkAPI) =>{
    try {
        const response = await postRequestMethod(requestData, UrlConstants.GET_ALL_ORDER_COUNT);
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