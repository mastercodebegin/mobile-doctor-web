import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, postRequestMethod, putRequestMethodWithBodyAndParam } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

const storeData = localStorage.getItem("brand")

interface User {
    id : string;
    name : string;
}

interface Brand {
isLoading : boolean;
isSuccess : boolean;
isError : boolean;
message : string;
BrandData : User[];
Edit : {brand : User | {name : string}, isEdit : boolean};
}

const initialState : Brand = {
    isLoading : false,
    isSuccess : false,
    isError : false,
    message : "",
    BrandData : storeData ? JSON.parse(storeData) : [],
    Edit : {brand : {name : ""}, isEdit : false}
}

const BrandSlice = createSlice({
    name : 'BrandSlice',
    initialState,
    reducers : {
        Remove : (state , action) =>{
            return{
                ...state,
                BrandData : state.BrandData.filter(item => item.id !== action.payload)
            }
        },
        Update : (state , action) =>{
            return {
                ...state,
                Edit : {brand : action.payload , isEdit : true}
            }
        },
          restore: (state, action) => {
                    return {
                        isLoading: false,
                        isSuccess: false,
                        isError: false,
                        message: "",
                        BrandData: storeData ? JSON.parse(storeData) : [],
                        Edit: { category: {}, isEdit: false }
                    }
                }
    },
    extraReducers : (builder) =>{
        builder 
         .addCase(GetAllBrand.pending  , (state ) =>{
                    state.isLoading = true
                    state.isSuccess = false
                })
                .addCase(GetAllBrand.fulfilled , (state , action) =>{
                    state.isLoading = false;
                    // console.log("fulfilled")
                    state.isSuccess = true;
                    state.BrandData = action.payload
                })
                .addCase(GetAllBrand.rejected , (state , action) =>{
                    state.isLoading = false;
                    state.isSuccess = false;
                    // console.log("Add Category fetch Faield ----------", action.payload)
                })

                .addCase(CreateBrand.pending , (state) =>{
                            state.isLoading = true
                            state.isSuccess = false
                        })
                        .addCase(CreateBrand.fulfilled , (state , action) =>{
                            state.isLoading = false;
                            state.isSuccess = true;
                            state.BrandData = [...state.BrandData , action.payload]
                        })
                        .addCase(CreateBrand.rejected , (state , action) =>{
                            state.isLoading = false
                            state.isSuccess = false
                            // console.log("Category Not Created..." , action.payload)
                        })

                        .addCase(UpdateBrand.pending, (state) =>{
                            state.isLoading = true
                            state.isSuccess = false
                            state.isError = false
                        })
                        .addCase(UpdateBrand.fulfilled , (state , action) =>{
                            state.isLoading = false
                            state.isSuccess = true
                            state.isError = false
                            state.message = "Brand Updated Successfully!!"
                            state.BrandData = state.BrandData.map((brand) => brand.id === action.payload?.id ? action.payload : brand)
                            state.Edit = {isEdit : false, brand : {name : ""}}
                        })
                        .addCase(UpdateBrand.rejected , (state , action) =>{
                             state.isLoading = false
                state.isSuccess = false
                state.isError = true;
                state.message = action.payload || "Failed to update Brand";
                        })
    }
})


export default BrandSlice.reducer
export const { Remove , Update , restore} = BrandSlice.actions


// Get All Brands Thunk
export const GetAllBrand = createAsyncThunk('FETCH/BRANDS' , async (_, thunkAPI) =>{
    try {
        const response = await getRequestMethod(UrlConstants.GET_ALL_BRAND)
        // console.log(response)
        return response
    } catch (error : any ) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})


// Create Brand Thunk
export const CreateBrand = createAsyncThunk("CREATE/BRAND" , async (newCategory, thukAPI) =>{
    try {
        const response = await postRequestMethod(newCategory , UrlConstants.ADD_BRAND)
        // console.log(response)
        return response
    } catch (error : any) {
        const message = error.response.data.message
        return thukAPI.rejectWithValue(message)
    }
})


// Update Brand Thunk
export const UpdateBrand = createAsyncThunk("UPDATE/BRAND" , async (id : string , thunkAPI) =>{
    try {
        const updateData = thunkAPI.getState().BrandSlice?.Edit?.brand;
        // console.log(updateData);
        if(!updateData) return thunkAPI.rejectWithValue("No Data to update!!")

            const response = await putRequestMethodWithBodyAndParam(
                {name : updateData.name},
                UrlConstants.UPDATE_BRAND,
                id
            );
            // console.log("Update response:" , response)
            return response;
    } catch (error : any) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})