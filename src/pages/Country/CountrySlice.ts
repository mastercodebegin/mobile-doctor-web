import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, postRequestMethod, putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.COUNTRY);

interface User {
  id: number;
  name: string;
  isoCode: string;
}

interface Country {
    isLoading: boolean;
    isSuccess: boolean;
    countryData: User[];
    Edit: {country: User | {name: string}, isEdit: boolean}
}

const initialState: Country = {
    isLoading: false,
    isSuccess: false,
    countryData: storeData || [],
    Edit: {country: {name: ""}, isEdit: false}
}

const CountrySlice = createSlice({
    name: "CountrySlice",
    initialState,
     reducers: {
         restore: (state) => {
        return {
            ...state,
            Edit: { country: null, isEdit: false }
        }
    },
        Update : (state , action) =>{
            return {
                ...state,
                Edit : {country : action.payload , isEdit : true}
            }
        },
        Remove: (state, action) =>{
            const updateCountryData = state.countryData.filter(item => item.id !== action.payload);
    LocalStorageManager.saveData(STORAGE_KEYS.COUNTRY, updateCountryData);
            return {
                ...state,
                countryData: updateCountryData
            }
        }
     },
  extraReducers: (builder) => {
        builder 
  .addCase(GetAllCountries.pending  , (state ) =>{
  state.isLoading = true
  state.isSuccess = false
  })
  .addCase(GetAllCountries.fulfilled , (state , action) =>{
  state.isLoading = false;
  state.isSuccess = true;
  state.countryData = action.payload;
  LocalStorageManager.saveData(STORAGE_KEYS.COUNTRY, action.payload);
  })
  .addCase(GetAllCountries.rejected , (state , action) =>{
  state.isLoading = false;
  state.isSuccess = false;
  console.log("Country Data Fetch Faield ----------", action.payload)
                      })
  
  .addCase(GetCountryById.pending  , (state ) =>{
  state.isLoading = true
  state.isSuccess = false
  })
  .addCase(GetCountryById.fulfilled , (state , action) =>{
  state.isLoading = false;
  state.isSuccess = true;
  state.countryData = action.payload;
  LocalStorageManager.saveData(STORAGE_KEYS.COUNTRY, action.payload);
  })
  .addCase(GetCountryById.rejected , (state , action) =>{
  state.isLoading = false;
  state.isSuccess = false;
  console.log("Single Country fetch Faield ----------", action.payload)
  })
      
  .addCase(CreateCountry.pending , (state) =>{
  state.isLoading = true
  state.isSuccess = false
  })
  .addCase(CreateCountry.fulfilled , (state , action) =>{
  state.isLoading = false;
  state.isSuccess = true;
  state.countryData = [...state.countryData , action.payload];
  LocalStorageManager.saveData(STORAGE_KEYS.COUNTRY, [...state.countryData]);
  })
  .addCase(CreateCountry.rejected , (state , action) =>{
  state.isLoading = false
  state.isSuccess = false
  console.log("Country Not Created..." , action.payload)
  })

  
                        .addCase(UpdateCountry.pending, (state) =>{
                              state.isLoading = true
                              state.isSuccess = false
                          })
                          .addCase(UpdateCountry.fulfilled , (state , action) =>{
                              state.isLoading = false
                              state.isSuccess = true
                              state.countryData = state.countryData.map((brand) => brand.id === action.payload?.id ? action.payload : brand)
                              state.Edit = {isEdit : false, country : {name : ""}};
                              LocalStorageManager.saveData(STORAGE_KEYS.COUNTRY, [...state.countryData]);
                          })
                          .addCase(UpdateCountry.rejected , (state , action) =>{
                               state.isLoading = false
                  state.isSuccess = false
                  console.log(action.payload || "Failed to update Brand")
                          })
  
  }
})

export default CountrySlice.reducer
export const {restore, Update, Remove} = CountrySlice.actions

// Fetch All Countries Thunk
export const GetAllCountries = createAsyncThunk("FETCH/ALL/COUNTRY", async (_, thunkAPI) =>{
    try {
        const response = await getRequestMethod(UrlConstants.GET_ALL_COUNTRY);
        console.log("Response Data :---", response);
        return response
    } catch (error: any) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Fetch By Id Thunk
export const GetCountryById = createAsyncThunk("FETCH/COUNTRY/BY/ID", async (param:number, thunkAPI) =>{
    try {
const response = await getRequestMethod(
  `${UrlConstants.GET_COUNTRY_BY_ID}?stateId=${param}`
);

        console.log("Response Data :---", response);
        return response
    } catch (error: any) {
        const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Create Country Thunk
export const CreateCountry = createAsyncThunk("CREATE/COUNTRY", async(requestData, thunkAPI) =>{
    try {
        const response = await postRequestMethod(requestData, UrlConstants.ADD_COUNTRY);
        console.log("Response Data :----", response);
        return response
    } catch (error: any) {
        const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Update Country Thunk
export const UpdateCountry = createAsyncThunk("UPDATE/COUNTRY", async(id:number, thunkAPI) =>{
    try {
        const updateData = thunkAPI.getState()?.CountrySlice?.Edit?.country;
        if(!updateData) return thunkAPI.rejectWithValue("No Data to update!!");
        const payload = {
            id: id,
            name: updateData.name,
            isoCode: updateData.isoCode
        }
        const response = await putRequestMethod(payload, UrlConstants.UPDATE_COUNTRY);
        console.log("Update response:" , response)
                        return response;
    } catch (error: any) {
        const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})