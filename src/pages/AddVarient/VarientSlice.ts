import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteRequestMethodWithParam, getRequestMethod, postRequestMethodForAddVariant, putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

const storedData = localStorage.getItem("Variant")

interface ModalImages {
  id: number | string;
  imageName: string;
  is_deleted: boolean | null;
}

interface ColorName {
  id: number | string;
  color: string;
  colorCode: string;
  is_deleted: boolean | null
}

interface VariantColors {
  id: number | string;
  colorName: ColorName[];
  modalImages: ModalImages[];
}

interface VariantStringData {
  id: number | string;
  ram: string;
  rom: string;
  selfieCamera: string;
  mainCamera: string;
  battery: string;
  network: string;
  isDeleted: boolean | null;
  variantColors: VariantColors[];
}

interface User {
  files: File[];
  ProductModalNumberPK: string;
  variantStringData: VariantStringData;
}

// Fixed EditVariant interface to match API response
interface EditVariant {
  id: number | string;
  ram: string;
  rom: string;
  selfieCamera: string;  // Changed back to camelCase to match API response
  mainCamera: string;    // Changed back to camelCase to match API response
  battery: string;
  network: string;
  isDeleted: boolean | null;
}

interface Variant {
  isLoading: boolean;
  isSuccess: boolean;
  Edit: {
    variant: EditVariant;
    isEdit: boolean;
  }
  AllVariantData: User[];
}

const initialState: Variant = {
  isLoading: false,
  isSuccess: false,
  Edit: {
    variant: {
      id: 0,
      ram: "",
      rom: "",
      selfieCamera: "",  // Fixed field name
      mainCamera: "",    // Fixed field name
      battery: "",
      network: "",
      isDeleted: null,
    }, 
    isEdit: false
  },
  AllVariantData: storedData ? JSON.parse(storedData) : [],
}

const variantSlice = createSlice({
  name: "variantSlice",
  initialState,
  reducers: {
    Update: (state, action) => {
  const payload = action.payload;
  
  if (payload && typeof payload === 'object') {
    // Find the index in AllVariantData based on variantStringData.id
    const index = state.AllVariantData.findIndex(item => 
      item?.variantStringData?.id === payload.id
    );
    
    if (index !== -1 && state.AllVariantData[index]) {
      // Update the variantStringData within the found item
      state.AllVariantData[index].variantStringData = {
        ...state.AllVariantData[index].variantStringData,
        ram: payload.ram || state.AllVariantData[index].variantStringData.ram,
        rom: payload.rom || state.AllVariantData[index].variantStringData.rom,
        selfieCamera: payload.selfieCamera || state.AllVariantData[index].variantStringData.selfieCamera,
        mainCamera: payload.mainCamera || state.AllVariantData[index].variantStringData.mainCamera,
        battery: payload.battery || state.AllVariantData[index].variantStringData.battery,
        network: payload.network || state.AllVariantData[index].variantStringData.network,
        isDeleted: payload.isDeleted !== undefined ? payload.isDeleted : state.AllVariantData[index].variantStringData.isDeleted
      };
    }
    
    // Update the Edit state for form handling
    return {
      ...state,
      Edit: {
        variant: {
          id: payload.id || 0,
          ram: payload.ram || "",
          rom: payload.rom || "",
          selfieCamera: payload.selfieCamera || "",
          mainCamera: payload.mainCamera || "",
          battery: payload.battery || "",
          network: payload.network || "",
          isDeleted: payload.isDeleted || false,
        },
        isEdit: true
      }
    };
  }
  
  return state;
},


    Remove: (state, action) => {
      return {
        ...state,
        AllVariantData: state.AllVariantData.filter(item => 
          item.id !== action.payload
        )
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchVariantByModalId.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(FetchVariantByModalId.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.AllVariantData = action.payload
      })
      .addCase(FetchVariantByModalId.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Variant Data by Modal Id Fetched Failed :--", action.payload)
      })

      // Add
      .addCase(CreateVariant.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(CreateVariant.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.AllVariantData = [...state.AllVariantData, action.payload]
        console.log("Created Variant Data :-------", action.payload)
      })
      .addCase(CreateVariant.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Variant Creation Failed :---------", action.payload)
      })

      // Update - Fixed
      .addCase(UpdateVariant.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
.addCase(UpdateVariant.fulfilled, (state, action) => {
  state.isLoading = false
  state.isSuccess = true

  console.log("Update fulfilled payload:", action.payload);

  if (action.payload && action.payload.id) {
    const updateIndex = state.AllVariantData.findIndex(item => 
      item && item.variantStringData && item.variantStringData.id === action.payload.id
    );
    
    if (updateIndex !== -1) {
      // Get the original ROM value before update
      const originalRom = state.Edit.variant.rom;
      
      // Update the variant data
      state.AllVariantData[updateIndex].variantStringData = {
        ...state.AllVariantData[updateIndex].variantStringData,
        id: action.payload.id,
        ram: action.payload.ram,
        rom: (action.payload.rom === "0" || action.payload.rom === 0) ? originalRom : action.payload.rom,
        selfieCamera: action.payload.selfieCamera,
        mainCamera: action.payload.mainCamera,
        battery: action.payload.battery,
        network: action.payload.network,
        isDeleted: action.payload.isDeleted,
        variantColors: action.payload.variantColors || state.AllVariantData[updateIndex].variantStringData.variantColors
      };
      
      console.log("ROM field preserved:", state.AllVariantData[updateIndex].variantStringData.rom);
    }
  }

  // Reset edit state
  state.Edit = {
    variant: initialState.Edit.variant,
    isEdit: false
  }
})

      .addCase(UpdateVariant.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Variant Update Failed :--", action.payload)
      })

      // Delete
      .addCase(DeleteVariant.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(DeleteVariant.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        console.log("Selected Variant Deleted!!", action.payload)
      })
      .addCase(DeleteVariant.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Failed To Delete Variant :", action.payload)
      })
  }
})

export default variantSlice.reducer
export const {Update, Remove} = variantSlice.actions

// Get Variant By Modal-Number ID Thunk
export const FetchVariantByModalId = createAsyncThunk(
  "FETCH/MODAL-NUMBER/VARIANTS", 
  async (id: number | string, thunkAPI) => {
    try {
      const response = await getRequestMethod(`${UrlConstants.GET_ALL_VARIANT_BY_MODAL_NUMBER_ID}/${id}`);
      console.log(response)
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Add Variant Thunk
export const CreateVariant = createAsyncThunk(
  "CREATE/VARIANT", 
  async (requestData: FormData, thunkAPI) => {
    try {
      console.log("FormData being sent:", requestData)
      
      for (let [key, value] of requestData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await postRequestMethodForAddVariant(requestData, UrlConstants.ADD_VARIANT)
      console.log("Response Data in Slice :-", response)
      return response?.data || response
    } catch (error: any) {
      console.error("CreateVariant Error:", error)
      const message = error?.response?.data?.message || error.message || "Unknown error occurred"
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// In your UpdateVariant thunk, try sending ROM without "GB":

export const UpdateVariant = createAsyncThunk("UPDATE/VARIANT", async (id: string | number, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as { variantSlice: Variant };
    const updateData = state.variantSlice.Edit.variant;

    if (!updateData) {
      return thunkAPI.rejectWithValue("No Data To Update!!");
    }

    // Create payload with ROM field cleanup
    const payload = {
      id: updateData.id,
      ram: updateData.ram,
      rom: updateData.rom.replace(/\s*GB\s*/gi, ''), // Remove "GB" from ROM
      selfieCamera: updateData.selfieCamera,
      mainCamera: updateData.mainCamera,
      battery: updateData.battery,
      network: updateData.network,
      isDeleted: updateData.isDeleted,
    }

    console.log("Update payload being sent:", payload);
    console.log("ROM field after cleanup:", payload.rom);
    
    const response = await putRequestMethod(
      payload,
      UrlConstants.UPDATE_VARIANT
    );
    
    console.log("Raw Update Response:", response);
    
    const responseData = response?.data || response;
    
    // If ROM is still "0" in response, preserve the original value
    if (responseData.rom === "0" || responseData.rom === 0) {
      responseData.rom = updateData.rom; // Keep original value
      console.log("ROM field was 0, preserving original:", responseData.rom);
    }
    
    return responseData;
  } catch (error: any) {
    console.error("UpdateVariant Error:", error);
    const message = error?.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
})



// Delete Variant Thunk
export const DeleteVariant = createAsyncThunk("DELETE/VARIANT", async (id: string | number, thunkAPI) => {
  try {
    const response = await deleteRequestMethodWithParam(
      { variantId: id },
      UrlConstants.DELETE_VARIANT
    );
    console.log("Delete Response :-", response);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Unknown error occurred"
    return thunkAPI.rejectWithValue(message)
  }
})