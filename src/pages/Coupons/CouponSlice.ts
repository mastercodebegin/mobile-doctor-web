import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethodWithParam, postRequestMethod, putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { pageSize } from "../../helper/ApplicationConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.COUPON)

interface User {
    id: number;
    couponCode: string;
    discountInPercent: number;
    expiredOn: string;
    createdBy: string
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
        expiredOn: string;
        createdBy: string
    }
}
}

const initialState:Coupon = {
    isLoading: false,
    isSuccess: false,
    couponData: storeData,
    Edit: {
        isEdit: false,
        coupon: {
        id: 0,
        couponCode: '',
        discountInPercent: 0,
        expiredOn: '',
        createdBy: ''
        }
    }
}

const CouponSlice = createSlice({
    name: "CouponSlice",
    initialState,
    reducers: {
Remove: (state, action) =>{
const updatedCouponData = state.couponData.filter(item => item.id !== action.payload);
LocalStorageManager.saveData(STORAGE_KEYS.COUPON, updatedCouponData);
return {
    ...state,
    couponData: updatedCouponData
}
},
Update: (state, action) =>{
    state.Edit = {
        isEdit: true,
        coupon: action.payload
    }
},
Restore: (state) =>{
    return {
        ...state,
        couponData: [],
        Edit: {isEdit: false, coupon: null}
    }
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
LocalStorageManager.saveData(STORAGE_KEYS.COUPON, action.payload)
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
LocalStorageManager.saveData(STORAGE_KEYS.COUPON, [...state.couponData])
})
.addCase(CreateCoupon.rejected , (state , action) =>{
state.isLoading = false;
state.isSuccess = false;
console.log("Coupon Data Fetch Faield ----------", action.payload)
})

// Update
.addCase(UpdateCoupon.pending  , (state ) =>{
state.isLoading = true
state.isSuccess = false
})
.addCase(UpdateCoupon.fulfilled , (state , action) =>{
state.isLoading = false;
state.isSuccess = true;
state.couponData = state.couponData.map((coupon) => coupon.id === action.payload?.id ? action.payload : coupon);
state.Edit = {isEdit: false, coupon: {id: 0, couponCode: "", discountInPercent: 0, expiredOn: "", createdBy: ""}};
LocalStorageManager.saveData(STORAGE_KEYS.COUPON, [...state.couponData])
})
.addCase(UpdateCoupon.rejected , (state , action) =>{
state.isLoading = false;
state.isSuccess = false;
console.log(action.payload || "Failed to update Coupon")
})

    }
})


export default CouponSlice.reducer
export const {Remove, Restore, Update} = CouponSlice.actions

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
        console.error("CreateBranch error:", error);
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
               console.error("CreateCoupon error:", error);
    const message = error?.response?.data?.message || error?.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
    }
})

// Update Coupon Thunk
export const UpdateCoupon = createAsyncThunk("UPDATE/COUPON", async (updateData, thunkAPI) =>{
    try {
        const response = await putRequestMethod(updateData, UrlConstants.UPDATE_COUPON);
        console.log("Update response:", response);
    return response;
    } catch (error: any) {
             console.error("UpdateCoupon error:", error);
    const message = error?.response?.data?.message || error?.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
    }
})