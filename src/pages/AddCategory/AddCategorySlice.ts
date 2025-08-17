import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteRequestMethodWithParam, getRequestMethod, postRequestMethod, putRequestMethodWithBodyAndParam } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

const storedData = localStorage.getItem("categories");

interface User {
    id: string;
    name: string;
}

interface AddCategory {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
    data: User[];
    Edit: { category: User | { name: string }, isEdit: boolean };
}

const initialState: AddCategory = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
    data: storedData ? JSON.parse(storedData) : [],
    Edit: { category: { name: "" }, isEdit: false }, 
}

const AddCategorySlice = createSlice({
    name: "AddCategorySlice",
    initialState,
    reducers: {
        Remove: (state, action) => {
            return {
                ...state,
                data: state.data.filter(item => item.id !== action.payload)
            }
        },
        // Added Update reducer for edit mode
        Update: (state, action) => {
            return {
                ...state,
                Edit: { category: action.payload, isEdit: true }
            }
        },
        // Added restore reducer
        restore: (state, action) => {
            return {
                isLoading: false,
                isSuccess: false,
                isError: false,
                message: "",
                data: storedData ? JSON.parse(storedData) : [],
                Edit: { category: {}, isEdit: false }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetAllCategory.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(GetAllCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.data = action.payload
            })
            .addCase(GetAllCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload || "Failed to fetch categories";
            })

            .addCase(CreateCategory.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(CreateCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.data = [...state.data, action.payload]
            })
            .addCase(CreateCategory.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true;
                state.message = action.payload || "Failed to create category";
            })

            .addCase(RemoveCategory.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(RemoveCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = "Category deleted successfully";
                state.data = state.data.filter((item) => item?.id !== action.payload);
                console.log('Category deleted from state:', action.payload);
                console.log('Updated data:', state.data);
            })
            .addCase(RemoveCategory.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true;
                state.message = action.payload || "Failed to delete category";
            })

            // Updated UpdateCategory cases
            .addCase(UpdateCategory.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(UpdateCategory.fulfilled, (state, action) => {
                console.log("Update fulfilled - payload:", action.payload);
                console.log("Edit state:", state.Edit);

                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = "Category updated successfully";

                // Update the specific category in the array
                state.data = state.data.map(category =>
                    category.id === action.payload?.id ? action.payload : category
                );
                state.Edit = { isEdit: false, category: { name: "" } }; 
            })
            .addCase(UpdateCategory.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true;
                state.message = action.payload || "Failed to update category";
            })
    }
})

export default AddCategorySlice.reducer
export const { Remove, Update, restore } = AddCategorySlice.actions

// Get AddCategory Data Thunk
export const GetAllCategory = createAsyncThunk('FETCH/ADDCATEGORY', async (_, thunkAPI) => {
    try {
        const response = await getRequestMethod(UrlConstants.GET_ALL_CATEGORY)
        return response
    } catch (error: any) {
        const message = error.response?.data?.message || "Failed to fetch categories"
        return thunkAPI.rejectWithValue(message)
    }
})

// Create Category Thunk
export const CreateCategory = createAsyncThunk('CREATE/CATEGORY', async (newCategory, thunkAPI) => {
    try {
        const response = await postRequestMethod(newCategory, UrlConstants.ADD_CATEGORY)
        return response
    } catch (error: any) {
        const message = error.response?.data?.message || "Failed to create category"
        return thunkAPI.rejectWithValue(message)
    }
})

// Update Category Thunk
export const UpdateCategory = createAsyncThunk("UPDATE/CATEGORY", async (id: string, thunkAPI) => {
    try {
        const updateData = thunkAPI.getState().AddCategorySlice?.Edit?.category;
        console.log(updateData);

        if (!updateData) return thunkAPI.rejectWithValue("No data to update");

        const response = await putRequestMethodWithBodyAndParam(
            {
                name: updateData.name, 
            },
            UrlConstants.UPDATE_CATEGORIE, 
            id
        );

        console.log("Update response:", response);
        return response;
    } catch (error: any) {
        const message = error.response?.data?.message || "Failed to update category";
        return thunkAPI.rejectWithValue(message);
    }
});

export const RemoveCategory = createAsyncThunk("DELETE/CATEGORY", async (id: string, thunkAPI) => {
    try {
        const response = await deleteRequestMethodWithParam({id}, UrlConstants.DELETE_CATEGORIE);
        console.log('Delete response:', response);
        return id;
    } catch (error: any) {
        const message = error.response?.data?.message || "Failed to delete category";
        return thunkAPI.rejectWithValue(message);
    }
});