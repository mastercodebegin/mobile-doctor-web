import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, postRequestMethod, postRequestMethodWithBodyAndParam} from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

const storedData = localStorage.getItem("colores");

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
colorData : storedData ? JSON.parse(storedData) : [],
Edit : {Color : { id : "", color : "", colorCode : ""}, isEdit : false},
}

const ColorNameSlice = createSlice({
    name : "ColorNameSlice",
    initialState,
    reducers : {
        restore : (state , action) =>{
            return{
                isLoading : false,
                isSuccess : false,
                colorData : storedData ? JSON.parse(storedData) : [],
                Edit : {Color : {}, isEdit : false}
            }
        },
        Update : (state, action) =>{
            //   console.log("Color Edit Payload Local:", action.payload);
            return{
    ...state,
    Edit : {Color : action.payload, isEdit : true}                
            }
        },
        Remove: (state , action) =>{
            return{
                ...state,
                colorData : state.colorData.filter(item => item.id !== action.payload)
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
            // const updatedIndex = state.colorData.findIndex(item => item.id === action.payload.id);
            // if(updatedIndex !== -1) {
            //     state.colorData[updatedIndex] = action.payload;
            // }
            // state.Edit = {
            //     color: initialState.Edit.color,
            //     isEdit: false
            // };

            state.colorData = state.colorData.map((color) => color.id === action.payload?.id ? action.payload : color)
            state.Edit = {isEdit : false, Color : {id : "", color : "", colorCode : ""}}

            console.log("Update Color Name Data :--", action.payload)
        })
        .addCase(UpdateColorName.rejected, (state , action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("Color Name Update Failed :--", action.payload)
        })
    }
})

export default ColorNameSlice.reducer
export const {restore , Update, Remove} = ColorNameSlice.actions


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


// // Update Color Thunk
// export const UpdateColorName = createAsyncThunk("UPDATE/COLOR", async (id : string, thunkAPI) =>{
//     try {
//         const updateData = thunkAPI.getState().ColorNameSlice.Edit.color;
//         if(!updateData) return thunkAPI.rejectWithValue("No Data To Update");

//         const response = await putRequestMethodWithBodyAndParam(
//             {color : updateData.color, colorCode : updateData.colorCode                
//             },
//             UrlConstants.UPDATE_COLOR,
//             id
//         );
//         console.log("Update Response :--", response)
//         return response

//     } catch (error : any) {
//         const message = error.response.data.message || "Failed to Update Color"
//         return thunkAPI.rejectWithValue(message)
//     }
// })


// Update Color Thunk
export const UpdateColorName = createAsyncThunk("UPDATE/COLOR", async (id : string, thunkAPI) =>{
    try {
        const updateData = thunkAPI.getState().ColorNameSlice?.Edit?.Color

        console.log("Color Update Data:", updateData);

        if(!updateData || !updateData.color || !updateData.colorCode) return thunkAPI.rejectWithValue("No Data To Update");

        const payload = {
            color : updateData.color,
            colorCode : updateData.colorCode
        }
        console.log("Update Payload :--", payload)

        const response = await postRequestMethodWithBodyAndParam(
           payload,
            UrlConstants.UPDATE_COLOR,
            id
        );
        console.log("Update Response :--", response)
        return response

    } catch (error : any) {
        const message = error.response?.data?.message || error.message || "Failed to Update Color"
        return thunkAPI.rejectWithValue(message)
    }
})