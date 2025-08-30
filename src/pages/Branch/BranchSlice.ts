import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, postRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.BRANCH);

interface Role {
  id: number;
  name: string;
}

interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  password: string;
  createdAt: string;
  deviceToken: string;
  role: Role;
  vendor: null;
}

interface Country {
  id: number;
  name: string;
  isoCode: string;
}

interface State {
  id: number;
  name: string;
  countries: Country;
}

interface City {
  id: number;
  name: string;
  states: State;
}

interface User {
  id: number;
  address: string;
  countries: Country;
  states: State;
  cities: City;
  user: UserDetails;
}


interface Branch {
    isLoading: boolean;
    isSuccess: boolean;
    branchData: User[];
     Edit: {
    isEdit: boolean;
    branch: User | {
      id: number;
      address: string;
      countries: {
        id: number;
      };
      states: {
        id: number;
      };
      cities: {
        id: number;
      };
      user: {
        id: number;
      };
    };
  };
}

const initialState: Branch = {
    isLoading: false,
    isSuccess: false,
    branchData: storeData,
Edit: {
    isEdit: false,
    branch: {
      id: 0,
      address: "",
      countries: { id: 0 },
      states: { id: 0 },
      cities: { id: 0 },
      user: { id: 0 }
    }
  }
}

const BranchSlice = createSlice({
    name: "BranchSlice",
    initialState,
    reducers: {
        Remove: (state, action) =>{
            const updatedBranchData = state.branchData.filter(item => item.id !== action.payload);
    LocalStorageManager.saveData(STORAGE_KEYS.BRANCH, updatedBranchData);
    return {
        ...state,
        branchData: updatedBranchData
    };
        },
        Update : (state: any, action: any) => {
    console.log("🔄 Redux Update Action:");
    console.log("Current Edit State:", state.Edit);
    console.log("New Data:", action.payload);
    
    state.Edit = {
        isEdit: true,
        branch: action.payload
    };
    
    console.log("🔄 Updated Edit State:", state.Edit);
},
         Restore: (state) =>{
            return {
                ...state,
                branchData: [],
                Edit: {isEdit: false, branch: null}
            }
         }
    },
    extraReducers: (builder) =>{
        builder
                     .addCase(GetAllBranch.pending  , (state ) =>{
                     state.isLoading = true
                     state.isSuccess = false
                     })
                     .addCase(GetAllBranch.fulfilled , (state , action) =>{
                     state.isLoading = false;
                     state.isSuccess = true;
                     state.branchData = action.payload,
                     LocalStorageManager.saveData(STORAGE_KEYS.BRANCH, action.payload);
                     })
                     .addCase(GetAllBranch.rejected , (state , action) =>{
                     state.isLoading = false;
                     state.isSuccess = false;
                     console.log("Branch Data Fetch Faield ----------", action.payload)
                                         })
                                         
             .addCase(CreateBranch.pending , (state) =>{
             state.isLoading = true
             state.isSuccess = false
             })
             .addCase(CreateBranch.fulfilled , (state , action) =>{
             state.isLoading = false;
             state.isSuccess = true;
             state.branchData = [...state.branchData , action.payload];
             LocalStorageManager.saveData(STORAGE_KEYS.BRANCH, [...state.branchData]);
             })
             .addCase(CreateBranch.rejected , (state , action) =>{
             state.isLoading = false
             state.isSuccess = false
             console.log("Branch Not Created..." , action.payload)
             })  
                .addCase(UpdateBranch.pending, (state) =>{
                state.isLoading = true
                state.isSuccess = false
                                       })
                .addCase(UpdateBranch.fulfilled , (state , action) =>{
                state.isLoading = false
                state.isSuccess = true
                state.branchData = state.branchData.map((brand) => brand.id === action.payload?.id ? action.payload : brand)
                state.Edit = {isEdit : false, branch : {id: 0, address: "", countries: null, states: null, cities: null, user: null},}
                LocalStorageManager.saveData(STORAGE_KEYS.BRANCH, [...state.branchData]);
                                                                })
                .addCase(UpdateBranch.rejected , (state , action) =>{
                state.isLoading = false
                state.isSuccess = false
                console.log(action.payload || "Failed to update Branch")
                                                  })                                       
    }
})


export default BranchSlice.reducer
export const {Remove, Update, Restore} = BranchSlice.actions

// Fetch All Branch Thunk
export const GetAllBranch = createAsyncThunk("FETCH/ALL/BRANCH", async (_, thunkAPI) =>{
    try {
        const response = await getRequestMethod(UrlConstants.GET_ALL_BRANCH);
             console.log("Response Data :---", response);
        return response
    } catch (error: any) {
          const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Create Branch Thunk
export const CreateBranch = createAsyncThunk("CREATE/BRANCh", async (requestData, thunkAPI) =>{
    try {
          const response = await postRequestMethod(requestData, UrlConstants.ADD_BRANCH);
                console.log("Response Data :---", response);
                return response
    } catch (error: any) {
             const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Update Branch Thunk
export const UpdateBranch = createAsyncThunk("UPDATE/BRANCH", async (updateData: any, thunkAPI) => {
  try {
    const response = await postRequestMethod(updateData, UrlConstants.UPDATE_BRANCH);
    console.log("Update response:", response);
    return response;
  } catch (error: any) {
    console.error("UpdateBranch error:", error);
    const message = error?.response?.data?.message || error?.message || "Something went wrong";
    return thunkAPI.rejectWithValue(message);
  }
});


