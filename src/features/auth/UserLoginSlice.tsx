//@ts-nocheck

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { deleteRequestMethodWithParam, getRequestMethod, getRequestMethodWithParam, postRequestMethod, putRequestMethod } from '../../context/service/CommonService';

import { CutomToastSuccess } from "../../component/CustomToastMessage";
import { navigateTo } from "../../helper/util/Utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

// interface RemoveProductData {
//     cartId: string; // Assuming cartId is a string
// }

//Action

export const loginUser = createAsyncThunk("loginUser", async (data: any) => {
  console.log("removeProductFromCart 2----------------------");
  const response = await putRequestMethod(data, UrlConstants.LOGIN);
  return response;
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
    data: {},
    isLoading: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.responseDetails;
      })
      .addCase(loginUser.rejected, (state) => {
        console.log("loginUser rejected------");
        state.isLoading = false;
      });
  },
  

  reducers: {
    clearLoginState: (state, action) => {
      state.data = {};
    },
  },
});

export default UserLoginSlice.reducer;
export const { clearLoginState } = UserLoginSlice.actions;
