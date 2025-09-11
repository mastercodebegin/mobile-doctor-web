import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequestMethodWithParams } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

interface Password {
    isLoading: boolean;
    isSuccess: boolean;
    UpdateData: {};
    error: string | null;
}

const initialState: Password = {
    isLoading: false,
    isSuccess: false,
    UpdateData: {},
    error: null
}

// Update Password Action
export const UpdatePasswordThunk = createAsyncThunk(
    "UPDATE/PASSWORD", 
    async (requestData: { oldPassWord: string; newPassWord: string; }, thunkAPI) => {
        try {
          const response = await postRequestMethodWithParams(requestData, UrlConstants.UPDATE_PASSWORD);            
            console.log("Password Update Response:", response);
            return response;
        } catch (error: any) {
            console.error("UpdatePassword error:", error);
            const message = error?.response?.data?.message || error?.message || "Failed to update password";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const PasswordSlice = createSlice({
    name: "PasswordSlice",
    initialState,
    reducers: {
        clearPasswordState: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.error = null;
            state.UpdateData = {};
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(UpdatePasswordThunk.pending, (state, action) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.error = null;
            console.log("Update Password is Pending:", action.meta.arg);
        })
        .addCase(UpdatePasswordThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.UpdateData = action.payload;
            state.error = null;
            console.log("Update Password Success:", action.payload);
        })
        .addCase(UpdatePasswordThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.error = action.payload as string;
            console.log("Update Password is Rejected:", action.payload);
        })
    }
});

export const { clearPasswordState } = PasswordSlice.actions;
export default PasswordSlice.reducer;