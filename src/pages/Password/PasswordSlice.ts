import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequestMethodWithParams, putRequestMethodWithParam } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

interface Password {
    isLoading: boolean;
    isSuccess: boolean;
    // UpdateData: {};
    // OtpData: {};
    // ForgotData: {};
    error: string | null;
}

const initialState: Password = {
    isLoading: false,
    isSuccess: false,
    // UpdateData: {},
    // OtpData: {},
    // ForgotData: {},
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

// OTP Thunk
export const GenerateOTP = createAsyncThunk("GENERATE/OTP", async (requestData, thunkAPI) =>{
    try {
        const response = await putRequestMethodWithParam(requestData, UrlConstants.GENERATE_OTP);
        console.log("Password Update Response:", response);
            return response;
    } catch (error: any) {
         console.error("UpdatePassword error:", error);
            const message = error?.response?.data?.message || error?.message || "Failed to update password";
            return thunkAPI.rejectWithValue(message);
    }
});

// Forgot Password Thunk
export const ForgotPassword = createAsyncThunk("FORGOT/PASSWORD", async (requestData, thunkAPI) =>{
    try {
        const response = await putRequestMethodWithParam(requestData, UrlConstants.FORGOT_PASSWORD);
            console.log("Password Update Response:", response);
            return response;
    } catch (error: any) {
          console.error("UpdatePassword error:", error);
            const message = error?.response?.data?.message || error?.message || "Failed to update password";
            return thunkAPI.rejectWithValue(message);
    }
})

const PasswordSlice = createSlice({
    name: "PasswordSlice",
    initialState,
    reducers: {
        clearPasswordState: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.error = null;
            // state.UpdateData = {};
            // state.OtpData = {};
            // state.ForgotData = {};
        }
    },
    extraReducers: (builder) => {
        builder
        // Update Password
        .addCase(UpdatePasswordThunk.pending, (state, action) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.error = null;
            console.log("Update Password is Pending:", action.meta.arg);
        })
        .addCase(UpdatePasswordThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            // state.UpdateData = action.payload;
            state.error = null;
            console.log("Update Password Success:", action.payload);
        })
        .addCase(UpdatePasswordThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.error = action.payload as string;
            console.log("Update Password is Rejected:", action.payload);
        })

        // OTP
                .addCase(GenerateOTP.pending, (state, action) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.error = null;
            console.log("Generate OTP is Pending:", action.meta.arg);
        })
        .addCase(GenerateOTP.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            // state.OtpData = action.payload;
            state.error = null;
            console.log("Generate OTP Success:", action.payload);
        })
        .addCase(GenerateOTP.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.error = action.payload as string;
            console.log("Generate OTP is Rejected:", action.payload);
        })

        // Forgot Password
               .addCase(ForgotPassword.pending, (state, action) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.error = null;
            console.log("Forgot Password is Pending:", action.meta.arg);
        })
        .addCase(ForgotPassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            // state.ForgotData = action.payload;
            state.error = null;
            console.log("Forgot Password Success:", action.payload);
        })
        .addCase(ForgotPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.error = action.payload as string;
            console.log("Forgot Password is Rejected:", action.payload);
        })
    }
});

export const { clearPasswordState } = PasswordSlice.actions;
export default PasswordSlice.reducer;