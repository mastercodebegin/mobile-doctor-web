import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, postRequestMethod, putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.CITY);

interface User {
  id: number;
  name: string;
  states: {
    id: number;
    name: string;
    countries: {
      id: number;
      name: string;
      isoCode: string;
    };
  };
}


interface City {
    isLoading: boolean;
    isSuccess: boolean;
    cityData: User[];
    Edit: {
        isEdit: boolean;
        city: User | {
            id: number;
            name: string;
  states: {
    id: number;
    name: string;
    countries: {
      id: number;
      name: string;
      isoCode: string;
    };
  };
        }
    }
}

const initialState: City = {
    isLoading: false,
    isSuccess: false,
    cityData: storeData,
    Edit: {isEdit: false, city: {id: 0, name: '', states: {id: 0, name: '', countries: {id: 0, name: '', isoCode: ''}}}}
}

const CitySlice = createSlice({
    name: "CitySlice",
     initialState,
    reducers: {
        Remove: (state, action) =>{
            const updatedCityData = state.cityData.filter(item => item.id !== action.payload);
            LocalStorageManager.saveData(STORAGE_KEYS.CITY, updatedCityData)
            return {
                ...state,
                cityData: updatedCityData
            }
        },
        Update: (state, action) =>{
            return{
                ...state,
                Edit: {isEdit : false, city: action.payload}
            }
        },
        Restore: (state) =>{
            return{
                ...state,
                Edit: {
                    isEdit: false,
                    city: {
                        id: 0,
                        name: '',
                        states: {
                            id: 0,
                            name: '',
                            countries: {
                                id: 0,
                                name: '',
                                isoCode: ''
                            }
                        }
                    }
                },
            }
        }
    },
       extraReducers: (builder) =>{
              builder 
             .addCase(GetAllCities.pending  , (state ) =>{
             state.isLoading = true
             state.isSuccess = false
             })
             .addCase(GetAllCities.fulfilled , (state , action) =>{
             state.isLoading = false;
             state.isSuccess = true;
             state.cityData = action.payload;
             LocalStorageManager.saveData(STORAGE_KEYS.CITY, action.payload);
             })
             .addCase(GetAllCities.rejected , (state , action) =>{
             state.isLoading = false;
             state.isSuccess = false;
             console.log("Country Data Fetch Faield ----------", action.payload)
                                 })
             
             .addCase(GetCitiesById.pending  , (state ) =>{
             state.isLoading = true
             state.isSuccess = false
             })
             .addCase(GetCitiesById.fulfilled , (state , action) =>{
             state.isLoading = false;
             state.isSuccess = true;
             state.cityData = action.payload;
             LocalStorageManager.saveData(STORAGE_KEYS.CITY, action.payload);
             })
             .addCase(GetCitiesById.rejected , (state , action) =>{
             state.isLoading = false;
             state.isSuccess = false;
             console.log("Single Country fetch Faield ----------", action.payload)
             })
   
                .addCase(GetCitiesByStateId.pending  , (state ) =>{
             state.isLoading = true
             state.isSuccess = false
             })
             .addCase(GetCitiesByStateId.fulfilled , (state , action) =>{
             state.isLoading = false;
             state.isSuccess = true;
             state.cityData = action.payload;
             LocalStorageManager.saveData(STORAGE_KEYS.CITY, action.payload);
             })
             .addCase(GetCitiesByStateId.rejected , (state , action) =>{
             state.isLoading = false;
             state.isSuccess = false;
             console.log("Single Country fetch Faield ----------", action.payload)
             })
                 
             .addCase(CreateCities.pending , (state) =>{
             state.isLoading = true
             state.isSuccess = false
             })
             .addCase(CreateCities.fulfilled , (state , action) =>{
             state.isLoading = false;
             state.isSuccess = true;
             state.cityData = [...state.cityData , action.payload];
             LocalStorageManager.saveData(STORAGE_KEYS.CITY, [...state.cityData]);
             })
             .addCase(CreateCities.rejected , (state , action) =>{
             state.isLoading = false
             state.isSuccess = false
             console.log("Country Not Created..." , action.payload)
             })
             
   .addCase(UpdateCities.pending, (state) =>{
   state.isLoading = true
   state.isSuccess = false
                          })
   .addCase(UpdateCities.fulfilled , (state , action) =>{
   state.isLoading = false
   state.isSuccess = true
   state.cityData = state.cityData.map((brand) => brand.id === action.payload?.id ? action.payload : brand)
   state.Edit = {isEdit : false, city : {id: 0, name: "", states: null,},};
   LocalStorageManager.saveData(STORAGE_KEYS.CITY, [...state.cityData]);
                                                   })
   .addCase(UpdateCities.rejected , (state , action) =>{
   state.isLoading = false
   state.isSuccess = false
   console.log(action.payload || "Failed to update Cities")
                                     })
       }
})

export default CitySlice.reducer
export const {Remove, Update, Restore} = CitySlice.actions

// Fetch All Cities Thunk
export const GetAllCities = createAsyncThunk("FETCH/ALL/CITIES", async (_, thunkAPI) =>{
    try {
        const response = await getRequestMethod(UrlConstants.GET_ALL_CITIES);
              console.log("Response Data :---", response);
        return response
    } catch (error: any) {
         const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Fetch Cities By Id Thunk
export const GetCitiesById = createAsyncThunk("FETCH/CITIES/BY/ID", async (id:number, thunkAPI) =>{
    try {
        const response = await getRequestMethod(`${UrlConstants.GET_CITIES_BY_ID}?id=${id}`);
        console.log("Response Data :---", response);
        return response
    } catch (error: any) {
        const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Feth Cities By State Id Thunk
export const GetCitiesByStateId = createAsyncThunk("FETCH/CITIES/BY/STATE/ID", async (id:string, thunkAPI) =>{
    try {
        const response = await getRequestMethod(`${UrlConstants.GET_CITIES_BY_STATE_ID}?id=${id}`);
        console.log("Response Data :---", response);
        return response
    } catch (error: any) {
        const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Add Cities Thunk
export const CreateCities = createAsyncThunk("CREATE/CITIES", async (requestData, thunkAPI) =>{
    try {
        const response = await postRequestMethod(requestData, UrlConstants.ADD_CITIES);
        console.log("Response Data :---", response);
        return response
    } catch (error: any) {
           const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})

// Update Cities Thunk
export const UpdateCities = createAsyncThunk("UPDATE/CITIES", async(id:number, thunkAPI) =>{
    try {
        const updateData = thunkAPI.getState()?.CitySlice?.Edit?.city;
        if (!updateData) return thunkAPI.rejectWithValue("No Data to Update!!");
        const payload = {
id: id,
name: updateData.name,
states: {
    id: updateData.states.id,
    name: updateData.states.name,
    countries: {
    id: updateData.states.countries.id,
    name: updateData.states.countries.name,
    isoCode: updateData.states.countries.isoCode
    }
}
        }
            const response = await putRequestMethod(payload, UrlConstants.UPDATE_CITIES);
                    console.log("Update response:" , response)
                                    return response;
    } catch (error: any) {
          const message = error?.response?.data?.message || "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
})