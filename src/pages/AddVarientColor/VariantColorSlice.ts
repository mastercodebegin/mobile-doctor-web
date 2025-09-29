import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestMethodForAddVariant } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.VARIANT_COLOR);

interface ModalImages {
  id: number | string;
  imageName: string;
  is_deleted: boolean | null;
}

interface ColorName {
  id: number | string;
  color: string;
  colorCode: string;
  is_deleted: boolean | null;
}

interface ModalColorString {
  id: number | string;
  colorName: ColorName;
  modalImages: ModalImages[];
}

interface User {
  files?: File[];
  modalColorString?: ModalColorString;
  variantId?: string;
}

interface VariantColor {
  isLoading: boolean;
  isSuccess: boolean;
  AllVariantColorData: User[];
  error: string | null;
}

const initialState: VariantColor = {
  isLoading: false,
  isSuccess: false,
  error: null,
  AllVariantColorData: storeData || [],
};

const VariantColorSlice = createSlice({
  name: "VariantColorSlice",
  initialState,
  reducers: {
    resetVariantColorState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
    },
    clearVariantColorError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Variant Color
      .addCase(CreateVariantColor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(CreateVariantColor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.AllVariantColorData = [...state.AllVariantColorData, action.payload]
        LocalStorageManager.saveData(STORAGE_KEYS.VARIANT_COLOR, [...state.AllVariantColorData]);
      })
      .addCase(CreateVariantColor.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string;
      })
    
  }
});

export const { resetVariantColorState, clearVariantColorError } = VariantColorSlice.actions;
export default VariantColorSlice.reducer;


// Async thunk for adding variant color
export const CreateVariantColor = createAsyncThunk(
  'variantColor/addVariantColor',
  async (requestData: FormData, thunkAPI) => {
    try {
      console.log(requestData, FormData)

       for (let [key, value] of requestData.entries()) {
        console.log(`${key}:`, value);
      }


      const response = await postRequestMethodForAddVariant(requestData, UrlConstants.ADD_VARIANT_COLOR);
      console.log(response)
      return response?.data || response;
    } catch (error: any) {
      console.error("CreateVariantColor Error:", error)
      const message = error?.response?.data?.message || error.message || "Unknown error occurred"
      return thunkAPI.rejectWithValue(message)
    }
  }
);