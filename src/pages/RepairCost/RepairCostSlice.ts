import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, getRequestMethodWithParam, postRequestMethod, putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.REPAIR_COST);

interface BasicInfo {
  id: number;
  name: string;
  is_deleted: boolean;
}

interface Category extends BasicInfo {}

interface SubCategory extends BasicInfo {
  category: Category;
}

interface ProductSpecification {
  id: number;
  network: string;
  platform: string;
  rom: string;
  ram: string;
}

interface ProductModelNumber {
  id: number;
  name: string;
  brand: BasicInfo;
  categories: BasicInfo;
  subCategory: SubCategory;
  is_deleted: boolean;
  productSpecification: ProductSpecification;
}

interface ProductPart {
  id: number;
  name: string;
  subCategory: SubCategory;
  deleted: boolean;
}

interface EditRepairCost {
  isEdit: boolean;
  repairCost: RepairCost | null;
}

interface RepairCost {
  id: number;
  price: string;
  message: string;
  productModelNumber: ProductModelNumber;
  productPart: ProductPart;
}

interface RepairCostState {
  RepairCostData: RepairCost[];
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  Edit: EditRepairCost;
}

const initialState: RepairCostState = {
  isLoading: false,
  isSuccess: false,
  error: null,
  RepairCostData: storeData,
  Edit: {
    isEdit: false,
    repairCost: {
  id: 0,
  price: "",
  message: "",
  productModelNumber: {
    id: 0,
    name: "",
    brand: {
      id: 0,
      name: "",
      is_deleted: false
    },
    categories: {
      id: 0,
      name: "",
      is_deleted: false
    },
    subCategory: {
      id: 0,
      name: "",
      category: {
        id: 0,
        name: "",
        is_deleted: false
      },
      is_deleted: false
    },
    is_deleted: false,
    productSpecification: {
      id: 0,
      network: "",
      platform: "",
      rom: "",
      ram: ""
    }
  },
  productPart: {
    id: 0,
    name: "",
    subCategory: {
      id: 0,
      name: "",
      category: {
        id: 0,
        name: "",
        is_deleted: false
      },
      is_deleted: false
    },
    deleted: false
  }
}
    }
};

const RepairCostSlice = createSlice({
  name: 'RepairCostSlice',
  initialState,
  reducers: {
    resetRepairCostState: (state) => {
      state.RepairCostData = [];
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
    },  
setEditRepairCost: (state, action) => {
  state.Edit.repairCost = action.payload;
  state.Edit.isEdit = true; 
}, 
  clearEditRepairCost: (state) => {
      state.Edit.isEdit = false;
      state.Edit.repairCost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Repair Cost
      .addCase(GetAllRepairCost.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(GetAllRepairCost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.error = null;
        if (action.payload) {
          // Handle different response formats
          if (Array.isArray(action.payload)) {
            state.RepairCostData = action.payload;
          } else if (action.payload.data && Array.isArray(action.payload.data)) {
            state.RepairCostData = action.payload.data;
          } else if (action.payload.success && action.payload.data) {
            state.RepairCostData = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
          } else {
            state.RepairCostData = [];
          }
          LocalStorageManager.saveData(STORAGE_KEYS.REPAIR_COST, action.payload);
        } else {
          state.RepairCostData = [];
        }
      })
      .addCase(GetAllRepairCost.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string;
        console.log("Repair Cost Data Fetch Failed:", action.payload);
      })

      // Get Repair Cost by Modal ID
      .addCase(GetRepairCostByModalId.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(GetRepairCostByModalId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.error = null;
        if (action.payload) {
          // Handle different response formats
          if (Array.isArray(action.payload)) {
            state.RepairCostData = action.payload;
          } else if (action.payload.data && Array.isArray(action.payload.data)) {
            state.RepairCostData = action.payload.data;
          } else if (action.payload.success && action.payload.data) {
            state.RepairCostData = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
          } else if (typeof action.payload === 'object' && action.payload.id) {
            // Single object response
            state.RepairCostData = [action.payload];
          } else {
            state.RepairCostData = [];
          }
          LocalStorageManager.saveData(STORAGE_KEYS.REPAIR_COST, action.payload);
        } else {
          state.RepairCostData = [];
        }
      })
      .addCase(GetRepairCostByModalId.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string;
        state.RepairCostData = []; 
        console.log("Repair Cost Data Fetch By Modal ID Failed:", action.payload);
      })

// Get Repair Cost by SubCategory ID
.addCase(GetRepairCostBySubCategoryId.pending, (state) => {
  state.isLoading = true;
  state.isSuccess = false;
  state.error = null;
})
.addCase(GetRepairCostBySubCategoryId.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.error = null;

  if (action.payload) {
    // Handle different response formats
    if (Array.isArray(action.payload)) {
      state.RepairCostData = action.payload;
    } else if (action.payload.data && Array.isArray(action.payload.data)) {
      state.RepairCostData = action.payload.data;
    } else if (action.payload.success && action.payload.data) {
      state.RepairCostData = Array.isArray(action.payload.data)
        ? action.payload.data
        : [action.payload.data];
    } else if (typeof action.payload === "object" && action.payload.id) {
      // Single object response
      state.RepairCostData = [action.payload];
    } else {
      state.RepairCostData = [];
    }

    // Save in localStorage
    LocalStorageManager.saveData(STORAGE_KEYS.REPAIR_COST, action.payload);
  } else {
    state.RepairCostData = [];
  }
})
.addCase(GetRepairCostBySubCategoryId.rejected, (state, action) => {
  state.isLoading = false;
  state.isSuccess = false;
  state.error = action.payload as string;
  state.RepairCostData = []; 
  console.log(
    "Repair Cost Data Fetch By SubCategory ID Failed:",
    action.payload
  );
})


      // Create Repair Cost
      .addCase(CreateRepairCost.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(CreateRepairCost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.error = null;
        if (action.payload) {
          let newRepairCost = null;
          if (action.payload.data) {
            newRepairCost = action.payload.data;
          } else if (action.payload.id) {
            newRepairCost = action.payload;
          }
          
          if (newRepairCost) {
            // Add to beginning of array for better UX
            state.RepairCostData.unshift(newRepairCost);
            LocalStorageManager.saveData(STORAGE_KEYS.REPAIR_COST, [...state.RepairCostData]);
          }
        }
      })
      .addCase(CreateRepairCost.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string;
        console.log("Repair Cost Creation Failed:", action.payload);
      })

      // Update Repair Cost
      .addCase(UpdateRepairCost.pending, (state, action) =>{
        state.isLoading = true
        state.isSuccess = false
        console.log("Update Api Pending Wait :", action.payload)
      })
.addCase(UpdateRepairCost.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;

  console.log("Update fulfilled payload:", action.payload);

  const updatedItem = action.payload;

  if (updatedItem && updatedItem.id) {
    const itemIndex = state.RepairCostData.findIndex(
      (item) => item.id === updatedItem.id
    );

    if (itemIndex !== -1) {
      const originalItem = state.RepairCostData[itemIndex];

      state.RepairCostData[itemIndex] = {
        ...originalItem,
        ...updatedItem,
        price: updatedItem.price || originalItem.price,
        message: updatedItem.message || originalItem.message,
      };

      console.log("✅ RepairCost updated at index", itemIndex);
    }
  }

  LocalStorageManager.saveData(STORAGE_KEYS.REPAIR_COST, [...state.RepairCostData]);

  // Reset Edit state after successful update
  state.Edit = {
    isEdit: false,
    repairCost: initialState.Edit.repairCost,
  };

  console.log("Updated Repair Cost Data:", state.RepairCostData);
})
      .addCase(UpdateRepairCost.rejected, (state, action) =>{
        state.isLoading = false
        state.isSuccess = false
        console.log("Repair-cost Data Updted Failed :--", action.payload)
      })
  }
});

export const { resetRepairCostState, setEditRepairCost, clearEditRepairCost } = RepairCostSlice.actions;
export default RepairCostSlice.reducer;

// Get All Repair Thunks
export const GetAllRepairCost = createAsyncThunk(
  "FETCH/ALL/REPAIR-COST",
  async (_, thunkAPI) => {
    try {
      const response = await getRequestMethod(UrlConstants.GET_ALL_REPAIR_COST);
      console.log("Response To Fetch All Repair-Cost:", response);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || "Failed to fetch repair costs";
      console.error("GetAllRepairCost Error:", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get By Modal-Id Thunk
export const GetRepairCostByModalId = createAsyncThunk(
  "FETCH/REPAIR-COST/BY/ID",
  async (modelNumberId: number, thunkAPI) => {
    try {
      const params = { modelNumberId }; 
      const response = await getRequestMethodWithParam(params, UrlConstants.GET_REPAIR_COST_BY_ID);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || "Failed to fetch filtered repair costs";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// Get RepairCost By SubCategoryId Thunk
export const GetRepairCostBySubCategoryId = createAsyncThunk(
  "FETCH/REPAIR-COST/BY/SUBCATEGORY-ID",
  async ({ subCategoryId }: { subCategoryId: number }, thunkAPI) => {
    try {
      const params = {
        subCategoryId: subCategoryId
      };

      console.log("Sending params:", params);

      // API call
      const response = await getRequestMethodWithParam(
        params,
        UrlConstants.GET_REPAIR_COST_BY_SUBCATEGORY_ID
      );

      console.log("Response To Fetch Repair-Cost By SubCategoryId:", response);
      console.log(
        "Response Type:",
        typeof response,
        "Is Array:",
        Array.isArray(response)
      );

      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch repair costs by subCategoryId";
      console.error("GetRepairCostBySubCategoryId Error:", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Thunk
export const CreateRepairCost = createAsyncThunk(
  "CREATE/REPAIR-COST",
  async (requestData: any, thunkAPI) => {
    try {
      console.log("Creating repair cost with data:", requestData);
      const response = await postRequestMethod(requestData, UrlConstants.ADD_REPAIR_COST_);
      console.log("Response Data To Create:", response);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || "Failed to create repair cost";
      console.error("CreateRepairCost Error:", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Thunk
export const UpdateRepairCost = createAsyncThunk(
  "UPDATE/REPAIRCOST",
  async (id: any, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as any;
      const updateData = state.RepairCostSlice.Edit.repairCost;

      console.log("🔍 Update data from Redux:", updateData);
      console.log("🔍 Update data ID:", updateData?.id);

      if (!updateData || !updateData.price) {
        return thunkAPI.rejectWithValue("No Data To Update!!");
      }

      const requestBody = {
        id: updateData.id,
        price: updateData.price,
        message: updateData.message,
        productModelNumber: {
          id: updateData.productModelNumber?.id || 0,
          name: updateData.productModelNumber?.name || "",
          brand: {
            id: updateData.productModelNumber?.brand?.id || 0,
            name: updateData.productModelNumber?.brand?.name || "",
            is_deleted: updateData.productModelNumber?.brand?.is_deleted || false,
          },
          categories: {
            id: updateData.productModelNumber?.categories?.id || 0,
            name: updateData.productModelNumber?.categories?.name || "",
            is_deleted: updateData.productModelNumber?.categories?.is_deleted || false,
          },
          subCategory: {
            id: updateData.productModelNumber?.subCategory?.id || 0,
            name: updateData.productModelNumber?.subCategory?.name || "",
            category: {
              id: updateData.productModelNumber?.subCategory?.category?.id || 0,
              name: updateData.productModelNumber?.subCategory?.category?.name || "",
              is_deleted:
                updateData.productModelNumber?.subCategory?.category?.is_deleted || false,
            },
            is_deleted: updateData.productModelNumber?.subCategory?.is_deleted || false,
          },
          is_deleted: updateData.productModelNumber?.is_deleted || false,
          productSpecification: {
            id: updateData.productModelNumber?.productSpecification?.id || 0,
            network: updateData.productModelNumber?.productSpecification?.network || "",
            platform: updateData.productModelNumber?.productSpecification?.platform || "",
            rom: updateData.productModelNumber?.productSpecification?.rom || "",
            ram: updateData.productModelNumber?.productSpecification?.ram || "",
          },
        },
        productPart: {
          id: updateData.productPart?.id || 0,
          name: updateData.productPart?.name || "",
          subCategory: {
            id: updateData.productPart?.subCategory?.id || 0,
            name: updateData.productPart?.subCategory?.name || "",
            category: {
              id: updateData.productPart?.subCategory?.category?.id || 0,
              name: updateData.productPart?.subCategory?.category?.name || "",
              is_deleted: updateData.productPart?.subCategory?.category?.is_deleted || false,
            },
            is_deleted: updateData.productPart?.subCategory?.is_deleted || false,
          },
          deleted: updateData.productPart?.deleted || false,
        },
      };

      console.log("🛠️ Update payload being sent:", requestBody);

      const response = await putRequestMethod(
        requestBody,
        UrlConstants.UPDATE_REPAIR_COST
      );

      console.log("✅ Response Data By Update:", response);

      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to Update Repair Cost";

      console.error("❌ UpdateRepairCost Error:", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

