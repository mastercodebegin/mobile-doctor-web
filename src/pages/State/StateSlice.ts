import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, postRequestMethod, putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.STATE);

interface User {
  id: string | number;
  name: string;
  countries: {
    id: number;
    name: string;
    isoCode: string;
  } | null;
}


interface State {
    isLoading: boolean;
    isSuccess: boolean;
    stateData: User[];
    Edit: {
        state: User | {
            id: number;
            name: string;
            countries: {
                id: number;
                name: string;
                isoCode: string;
            } | null;
            isoCode: string
        };
        isEdit: boolean; 
};
}

const initialState: State = {
    isLoading: false,
    isSuccess: false,
    stateData: storeData,
    Edit: {
        isEdit: false, 
        state: {
        id: 0,
        name: '',
        isoCode: '',
        countries: {
            id: 0,
            name: '',
            isoCode: ''
        },
    }}
}

const StateSlice = createSlice({
    name: "StateSlice",
     initialState,
     reducers: {
        Remove: (state, action) =>{
            const updatedStateData = state.stateData.filter(item => item.id !== action.payload);
            LocalStorageManager.saveData(STORAGE_KEYS.STATE, updatedStateData)
            return{
                ...state,
                stateData:  updatedStateData
            }
        },
        restore: (state) =>{
            return {
                ...state,
                Edit: {
                    isEdit: false,
                    state: {
                        id: 0,
                        name: '',
                        countries: null,
                        isoCode: ''
                    }
                }
            }
        },
        Update: (state, action) =>{
            return {
                ...state,
                Edit: {
                    isEdit: false,
                    state: action.payload
                }
            }
        }
     },
    extraReducers: (builder) =>{
           builder 
          .addCase(GetAllState.pending  , (state ) =>{
          state.isLoading = true
          state.isSuccess = false
          })
          .addCase(GetAllState.fulfilled , (state , action) =>{
          state.isLoading = false;
          state.isSuccess = true;
          state.stateData = action.payload;
          LocalStorageManager.saveData(STORAGE_KEYS.STATE, action.payload);
          })
          .addCase(GetAllState.rejected , (state , action) =>{
          state.isLoading = false;
          state.isSuccess = false;
          console.log("Country Data Fetch Faield ----------", action.payload)
                              })
          
          .addCase(GetStateById.pending  , (state ) =>{
          state.isLoading = true
          state.isSuccess = false
          })
          .addCase(GetStateById.fulfilled , (state , action) =>{
          state.isLoading = false;
          state.isSuccess = true;
          state.stateData = action.payload;
          LocalStorageManager.saveData(STORAGE_KEYS.STATE, action.payload);
          })
          .addCase(GetStateById.rejected , (state , action) =>{
          state.isLoading = false;
          state.isSuccess = false;
          console.log("Single Country fetch Faield ----------", action.payload)
          })

             .addCase(GetStateByCountryId.pending  , (state ) =>{
          state.isLoading = true
          state.isSuccess = false
          })
          .addCase(GetStateByCountryId.fulfilled , (state , action) =>{
          state.isLoading = false;
          state.isSuccess = true;
          state.stateData = action.payload;
          LocalStorageManager.saveData(STORAGE_KEYS.STATE, action.payload);
          })
          .addCase(GetStateByCountryId.rejected , (state , action) =>{
          state.isLoading = false;
          state.isSuccess = false;
          console.log("Single Country fetch Faield ----------", action.payload)
          })
              
          .addCase(CreateState.pending , (state) =>{
          state.isLoading = true
          state.isSuccess = false
          })
          .addCase(CreateState.fulfilled , (state , action) =>{
          state.isLoading = false;
          state.isSuccess = true;
          state.stateData = [...state.stateData , action.payload];
          LocalStorageManager.saveData(STORAGE_KEYS.STATE, [...state.stateData]);
          })
          .addCase(CreateState.rejected , (state , action) =>{
          state.isLoading = false
          state.isSuccess = false
          console.log("Country Not Created..." , action.payload)
          })
          
.addCase(UpdateState.pending, (state) =>{
state.isLoading = true
state.isSuccess = false
                       })
.addCase(UpdateState.fulfilled , (state , action) =>{
state.isLoading = false
state.isSuccess = true
state.stateData = state.stateData.map((brand) => brand.id === action.payload?.id ? action.payload : brand)
state.Edit = {isEdit : false, state : {id: 0, name: "", countries: null, isoCode: ''},};
LocalStorageManager.saveData(STORAGE_KEYS.STATE, [...state.stateData]);;
                                                })
.addCase(UpdateState.rejected , (state , action) =>{
state.isLoading = false
state.isSuccess = false
console.log(action.payload || "Failed to update Brand")
                                  })
    }
})


export default StateSlice.reducer
export const {restore, Update, Remove} = StateSlice.actions

// Fetch All State Thunk
export const GetAllState = createAsyncThunk("FETCH/ALL/STATE", async(_, thunkAPI) =>{
    try {
        const response = await getRequestMethod(UrlConstants.GET_ALL_STATE);
        console.log("Response Data :---", response);
        return response
    } catch (error: any) {
         const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Fetch State By Country Id Thunk
export const GetStateByCountryId = createAsyncThunk("FETCH/STATE/BY/COUNTRY/ID", async (id:any, thunkAPI) =>{
    try {
        const response = await getRequestMethod(`${UrlConstants.GET_STATE_BY_COUNTRY_ID}?id=${id}`);
        console.log("Response Data :---", response);
        return response
    } catch (error: any) {
        const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Fetch State By Id Thunk
export const GetStateById = createAsyncThunk("FETCH/STATE/BY/ID", async (id:number, thunkAPI) =>{
    try {
        const response = await getRequestMethod(`${UrlConstants.GET_STATE_BY_ID}?id=${id}`);
        console.log("Response Data :---", response);
        return response
    } catch (error: any) {
        const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Add State Thunk
export const CreateState = createAsyncThunk("CREATE/STATE", async (requestData:any, thunkAPI) =>{
    try {
        const response = await postRequestMethod(requestData, UrlConstants.ADD_STATE);
        console.log("Response Data :---", response);
        return response
    } catch (error: any) {
        const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Update State Thunk
export const UpdateState = createAsyncThunk("UPDATE/STATE", async (id:number, thunkAPI) =>{
    try {
        const updateData = thunkAPI.getState()?.StateSlice?.Edit?.state;
        if (!updateData) return thunkAPI.rejectWithValue("No Data to Update!!")
            const payload = {
        id: id,
        name: updateData.name,
        countries: {
            id: updateData?.countries?.id,
            name: updateData?.countries?.name,
            isoCode: updateData?.countries?.isoCode
        },
        isoCode: updateData.isoCode
    }
    const response = await putRequestMethod(payload, UrlConstants.UPDATE_STATE);
            console.log("Update response:" , response)
                            return response;
    } catch (error: any) {
        const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})