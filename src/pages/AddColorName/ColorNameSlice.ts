import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, postRequestMethod, postRequestMethodWithBodyAndParam} from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.COLOR_NAME);

interface User {
    id : string;
    color : string;
    colorCode : string;
}

interface AddColor {
    isLoading : boolean;
    isSuccess : boolean;
    colorData : User[];
    Edit : {Color : User |  {id : number | string, color : string, colorCode : string}, isEdit : boolean};
}

const initialState : AddColor = {
isLoading : false,
isSuccess : false,
colorData : storeData || [],
Edit : {Color : { id : "", color : "", colorCode : ""}, isEdit : false},
}

const ColorNameSlice = createSlice({
    name : "ColorNameSlice",
    initialState,
    reducers : {
        restore : () =>{
            return{
                isLoading : false,
                isSuccess : false,
                colorData : storeData ? storeData : [],
                Edit : {Color : {}, isEdit : false}
            }
        },
          SetInitialData: (state, action) => {
            state.colorData = action.payload;
        },
        Update : (state, action) =>{
            return{
    ...state,
    Edit : {Color : action.payload, isEdit : true}                
            }
        },
        Remove: (state , action) =>{
            const updatedColorNameData = state.colorData.filter(item => item.id !== action.payload);
            LocalStorageManager.saveData(STORAGE_KEYS.BRANCH, updatedColorNameData);
            return{
                ...state,
                colorData : updatedColorNameData
            }
        }
    },
    extraReducers : (builder) =>{
        builder
        .addCase(GetAllColors.pending , (state) =>{
             state.isLoading = true
                state.isSuccess = false
        })
        .addCase(GetAllColors.fulfilled , (state , action) =>{
            state.isLoading = false;
                state.isSuccess = true;
                state.colorData = action.payload
                LocalStorageManager.saveData(STORAGE_KEYS.COLOR_NAME, action.payload);
        })
        .addCase(GetAllColors.rejected , (state , action) =>{
            state.isLoading = false;
                state.isSuccess = false;
                console.log("Failed to Fetch Color :---------", action.payload)
        })

        // Create
        .addCase(CreateColor.pending, (state) =>{
            state.isLoading = true
            state.isSuccess = false
        })
        .addCase(CreateColor.fulfilled, (state , action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.colorData = [...state.colorData, action.payload]
             LocalStorageManager.saveData(STORAGE_KEYS.COLOR_NAME, [...state.colorData]);
        })
        .addCase(CreateColor.rejected, (state , action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("Color Name Creation Failed :--------", action.payload)
        })

        // Update
        .addCase(UpdateColorName.pending , (state) =>{
            state.isLoading = true
            state.isSuccess = false
        })
        .addCase(UpdateColorName.fulfilled , (state , action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.colorData = state.colorData.map((color) => color.id === action.payload?.id ? action.payload : color)
            state.Edit = {isEdit : false, Color : {id : "", color : "", colorCode : ""}}

            LocalStorageManager.saveData(STORAGE_KEYS.COLOR_NAME, [...state.colorData]);
        })
        .addCase(UpdateColorName.rejected, (state , action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("Color Name Update Failed :--", action.payload)
        })
    }
})

export default ColorNameSlice.reducer
export const {restore , Update, Remove, SetInitialData} = ColorNameSlice.actions


// Get All-Colors
export const GetAllColors = createAsyncThunk("FETCH/ALL/COLORS" , async (_, thunkAPI) =>{
    try {
        const response = await getRequestMethod(UrlConstants.GET_ALL_COLOR)
        // console.log(response)
        return response
    } catch (error : any) {
          const message = error.response?.data?.message || "Failed to fetch Color"
        return thunkAPI.rejectWithValue(message)
    }
})


// Create Color
export const CreateColor = createAsyncThunk("CREATE/COLOR" , async (requestData , thunkAPI) =>{
    try {
        const response = await postRequestMethod(requestData, UrlConstants.ADD_COLOR)
        console.log(requestData , response)
        return response
    } catch (error : any) {
        const message = error.response?.data?.message || "Failed to Create Color"
        return thunkAPI.rejectWithValue(message)
    }
})


// Update Color Thunk
export const UpdateColorName = createAsyncThunk(
  "UPDATE/COLOR", 
  async (id: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as any;
      const updateData = state.ColorNameSlice?.Edit?.Color;

      if (!updateData || !updateData.color || !updateData.colorCode) {
        return thunkAPI.rejectWithValue("No Data To Update");
      }

      // ✅ Add ID inside payload too
      const payload = {
        id: id, // 👈 Important
        color: updateData.color,
        colorCode: updateData.colorCode
      };

      const response = await postRequestMethodWithBodyAndParam(
        payload,
        UrlConstants.UPDATE_COLOR,
        id
      );

      return {
        id: id, 
        color: response.color || payload.color,
        colorCode: response.colorCode || payload.colorCode,
        is_deleted: response.is_deleted
      };

    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to Update Color";
      return thunkAPI.rejectWithValue(message);
    }
  }
);