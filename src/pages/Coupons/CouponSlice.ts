import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethodWithParam, postRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { pageSize } from "../../helper/ApplicationConstants";

interface User {
    id: number;
    couponCode: string;
    discountInPercent: number;
    expiredOn: string
}

interface Coupon {
isLoading: boolean;
isSuccess: boolean;
couponData: User[];
Edit: {
    isEdit: boolean;
    coupon: User | {
        id: number;
        couponCode: string;
        discountInPercent: number
        expiredOn: string
    }
}
}

const initialState:Coupon = {
    isLoading: false,
    isSuccess: false,
    couponData: [],
    Edit: {
        isEdit: false,
        coupon: {
        id: 0,
        couponCode: '',
        discountInPercent: 0,
        expiredOn: ''

        }
    }
}

const CouponSlice = createSlice({
    name: "CouponSlice",
    initialState,
    reducers: {
Remove: (state, action) =>{
    
}
    },
    extraReducers: (builder) =>{
        builder
.addCase(GetAllCoupons.pending  , (state ) =>{
state.isLoading = true
state.isSuccess = false
})
.addCase(GetAllCoupons.fulfilled , (state , action) =>{
state.isLoading = false;
state.isSuccess = true;
state.couponData = action.payload.content
})
.addCase(GetAllCoupons.rejected , (state , action) =>{
state.isLoading = false;
state.isSuccess = false;
console.log("Coupon Data Fetch Faield ----------", action.payload)
})

// Create
.addCase(CreateCoupon.pending  , (state ) =>{
state.isLoading = true
state.isSuccess = false
})
.addCase(CreateCoupon.fulfilled , (state , action) =>{
state.isLoading = false;
state.isSuccess = true;
state.couponData = [...state.couponData, action.payload.content]
})
.addCase(CreateCoupon.rejected , (state , action) =>{
state.isLoading = false;
state.isSuccess = false;
console.log("Coupon Data Fetch Faield ----------", action.payload)
})

    }
})


export default CouponSlice.reducer

// Fetch All Coupons Thunk
export const GetAllCoupons = createAsyncThunk("FETCH/ALL/COUPONS", async (_, thunkAPI) =>{
    try {
        const param = {
            pageSize,
            pageNumber: 0
        }
       const response = await getRequestMethodWithParam(param, UrlConstants.GET_ALL_COUPONS)
       console.log("Response Data :---", response) 
       return response
    } catch (error: any) {
        console.error("UpdateBranch error:", error);
    const message = error?.response?.data?.message || error?.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
    }
})

// Create Coupon Thunk
export const CreateCoupon = createAsyncThunk("CREATE/COUPON", async (requestData, thunkAPI) =>{
    try {
        const response = await postRequestMethod(requestData, UrlConstants.ADD_COUPON);
        console.log("Response Data :---", response) 
       return response
    } catch (error: any) {
               console.error("UpdateBranch error:", error);
    const message = error?.response?.data?.message || error?.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
    }
})