import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethodWithParam, postRequestMethodForAddVariant } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { pageSize } from "../../helper/ApplicationConstants";


// interfaces.ts
interface VendorDocument {
  id: number;
  imageName: string;
  deleted: boolean;
  idtype: 'AADHAR_CARD' | 'VOTER_ID' | 'DRIVING_LICENSE' | 'GST' | 'GUMASTA' | 'PANCARD' | 'PASSPORT' | string;
  frontSide: boolean;
}

interface VendorRole {
  id: number;
  name: string;
}

interface Vendor {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  panCard: string;
  aadharNumber: string;
  businessName: string;
  businessAddress: string;
  gstNumber: string;
  pinCode: string;
  state: string;
  city: string;
  password: string;
  createdOn: string;
  accountStatus: 'APPROVED' | 'REJECTED' | 'PENDING' | string;
  role: VendorRole;
  vendorDocument: VendorDocument[];
  disabled: boolean;
  deleted: boolean;
  homeAddress: string;
}

interface VendorState {
  isLoading: boolean;
  isSuccess: boolean;
  data: Vendor[];
}

const initialState : VendorState = {
  isLoading : false,
        isSuccess : false,
        data : [],
}

const VendorSlice = createSlice({
    name : 'VendorSlice',
    initialState,
    reducers : {
      Remove : (state , action) =>{
state.data = state.data.filter(item => item.id !== action.payload)
localStorage.setItem("card", JSON.stringify(state.data))
      },
      Add : (state , action) =>{
        return{
            ...state,
            data : [...state.data, action.payload]
        }
      }
        },
    extraReducers : (builder) =>{
      builder
      .addCase(GetAllVendors.pending, (state, action) =>{
        state.isLoading = true
        state.isSuccess = false
        console.log("Fetch All Vendors Data is Pending :----", action.payload)
      })
      .addCase(GetAllVendors.fulfilled, (state ,action) =>{
        state.isLoading = false
        state.isSuccess = true
        state.data = action.payload.content
      })
      .addCase(GetAllVendors.rejected, (state, action) =>{
        state.isLoading = false
        state.isSuccess = false
        console.log("All Vendors Data is Rejected With Error :---", action.payload)
      })

      // Fetch by Email
      .addCase(GetVendorByEmail.pending, (state, action) =>{
        state.isLoading = true
        state.isSuccess = false
        console.log("Fetch All Vendors Data is Pending :----", action.payload)
      })
      .addCase(GetVendorByEmail.fulfilled, (state ,action) =>{
        state.isLoading = false
        state.isSuccess = true
        state.data = action.payload.content
      })
      .addCase(GetVendorByEmail.rejected, (state, action) =>{
        state.isLoading = false
        state.isSuccess = false
        console.log("All Vendors Data is Rejected With Error :---", action.payload)
      })

      // Fetch By Role Id
            .addCase(GetVendorByRoleId.pending, (state, action) =>{
        state.isLoading = true
        state.isSuccess = false
        console.log("Fetch All Vendors Data is Pending :----", action.payload)
      })
      .addCase(GetVendorByRoleId.fulfilled, (state ,action) =>{
        state.isLoading = false
        state.isSuccess = true
        state.data = action.payload.content
      })
      .addCase(GetVendorByRoleId.rejected, (state, action) =>{
        state.isLoading = false
        state.isSuccess = false
        console.log("All Vendors Data is Rejected With Error :---", action.payload)
      })

// Create
      .addCase(CreateVendor.pending, (state, action) =>{
        state.isLoading = true
        state.isSuccess = false
        console.log("Creating Vendors Data is Pending :----", action.payload)
      })
      .addCase(CreateVendor.fulfilled, (state ,action) =>{
        state.isLoading = false
        state.isSuccess = true
        state.data = [...state.data, action.payload]
      })
      .addCase(CreateVendor.rejected, (state, action) =>{
        state.isLoading = false
        state.isSuccess = false
        console.log("Create Data is Rejected With Error :---", action.payload)
      })
    }
})

export default VendorSlice.reducer
export const {Remove , Add} = VendorSlice.actions

// Fetch All Users-Management
export const GetAllVendors = createAsyncThunk("FETCH/ALL/VENTORS", async (_, thunkAPI) =>{
  try {
    const payload = {
      pageSize,
      pageNumber: 0
    }
    const response = await getRequestMethodWithParam(payload , UrlConstants.GET_ALL_USER);
    console.log("Response Data :--", response);
    return response
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Fetch By Email
export const GetVendorByEmail = createAsyncThunk("FETCH/VENDOR/BY/EMAIL", async (requestData: FormData, thunkAPI) =>{
  try {
    const payload = {
      pageSize,
      pageNumber: 0,
      email: requestData
    }
     const response = await getRequestMethodWithParam(payload , UrlConstants.GET_ALL_USER);
    console.log("Response Data :--", response);
    return response
  } catch (error: any) {
      const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Fetch By Role Id
export const GetVendorByRoleId = createAsyncThunk("FETCH/VENDOR/BY/ROLE/ID", async (requestData, thunkAPI) =>{
  try {
    const payload = {
      pageSize,
      pageNumber: 0,
      roleId: requestData
    }
     const response = await getRequestMethodWithParam(payload , UrlConstants.GET_ALL_USER);
    console.log("Response Data :--", response);
    return response
  } catch (error: any) {
      const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Create Vendor
export const CreateVendor = createAsyncThunk("CREATE/VENDOR", async (requestData: FormData, thunkAPI) =>{
  try {
    console.log(requestData)

     for (let [key, value] of requestData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }

    const response = await postRequestMethodForAddVariant(requestData, UrlConstants.CREATE_USER_BY_ADMIN);
    console.log("Response Data :---", response);
    return response
  } catch (error: any) {
    
     const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})