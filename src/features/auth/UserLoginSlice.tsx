//@ts-nocheck

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CutomToastSuccess } from "../../component/CustomToastMessage";
import { navigateTo } from "../../helper/util/Utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";


export const loginUser = createAsyncThunk("loginUser", async (data: any, thunkAPI) => {
try {
    console.log("removeProductFromCart 2----------------------");

  const response = await putRequestMethod(data, UrlConstants.LOGIN);
console.log(response)
     const nestedResponse = response?.responseDetails;

    const user = nestedResponse?.responseDetails;
    const token = nestedResponse?.jwtToken;

    if (!token) {
      return thunkAPI.rejectWithValue("Login failed: Token missing");
    }

    // Save both in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));

    return { user, token };

} catch (error: any) {
     return thunkAPI.rejectWithValue(error.message || "Login failed");
}
});

export const getAllCartItemsByUserId = createAsyncThunk(
  "getAllCartItemsByUserId",
  async (data) => {
    console.log("user slice----", data);
    const response = await getRequestMethod(
      UrlConstants.GET_ALL_CART_ITEMS_BY_USER_ID
    );
    return response;
  }
);

const UserLoginSlice = createSlice({
  name: "UserLoginSlice",
  initialState: {
    data: localStorage.getItem("authUser") ? JSON.parse(localStorage.getItem("authUser") || "{}") : {},
    isLoading: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        console.log("loginUser rejected------");
        state.isLoading = false;
      });
  },
  

  reducers: {
    clearLoginState: (state) => {
      state.data = {};
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { clearLoginState } = UserLoginSlice.actions;
export default UserLoginSlice.reducer;
