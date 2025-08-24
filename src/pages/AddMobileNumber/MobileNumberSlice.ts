import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, getRequestMethodWithParam, postRequestMethod, putRequestMethodWithBodyAndParam } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

const storedData = localStorage.getItem("MobileNumber")

// ✅ Product Specification (as per given API response)
interface ProductSpecification {
  id: number;
  ram: string;
  rom: string;
  network: string;
  platform: string;
}

// ✅ Brand structure
interface Brand {
  id: number;
  name: string;
  is_deleted: boolean | null;
}

// ✅ Category structure
interface Category {
  id: number;
  name: string;
  is_deleted: boolean | null;
}

// ✅ Sub-category structure
interface SubCategory {
  id: number;
  name: string;
  category: Category | null;
  is_deleted: boolean | null;
}

// ✅ Main Mobile Data Structure
interface User {
  id: number;
  name: string; // e.g. "iphone15"
  brand: Brand;
  categories: Category;
  subCategory: SubCategory;
  productSpecification: ProductSpecification;
  is_deleted: boolean | null;
}

// ✅ FIXED: Consistent Edit Modal Interface
interface EditModalNumber {
  id: number | string;
  name: string;
  brand: {
    id: number | string;
    name: string;
    is_deleted: boolean | null;
  };
  categories: {
    id: number | string;
    name: string;
    is_deleted: boolean | null;
  };
  subCategory: {
    id: number | string;
    name: string;
    category: {
      id: number | string;
      name: string;
      is_deleted: boolean | null;
    } | null;
    is_deleted: boolean | null;
  };
  productSpecification: {
    id: number | string;
    ram: string;
    rom: string;
    network: string;
    platform: string;
  };
  is_deleted: boolean | null;
}

interface ViewVariant {
   isLoading: boolean;
  isSuccess: boolean;
  data: Record<number, any[]>; 
  pagination: Record<number, any>; 
}

interface MobileNumber {
  isLoading: boolean;
  isSuccess: boolean;
  viewVariant: ViewVariant;
  Edit: {
    modalNumber: EditModalNumber;
    isEdit: boolean;
  };
  AllModalNumberData: User[];
  BrandModalNumberData: User[];
  MobileNumberData: User[];
}

// ✅ FIXED: Consistent initial state
const initialState: MobileNumber = {
  isLoading: false,
  isSuccess: false,
  viewVariant: {
isLoading: false,
isSuccess: false,
data: [],
pagination: {},
  },
  Edit: {
    modalNumber: {
      id: 0,
      name: '',
      brand: {
        id: 0,
        name: '',
        is_deleted: null
      },
      categories: {
        id: 0,
        name: '',
        is_deleted: null
      },
      subCategory: {
        id: 0,
        name: '',
        category: {
          id: 0,
          name: '',
          is_deleted: null
        },
        is_deleted: null
      },
      productSpecification: {
        id: 0,
        ram: '',
        rom: '',
        network: '',
        platform: ''
      },
      is_deleted: null
    },
    isEdit: false
  },
  AllModalNumberData: storedData ? JSON.parse(storedData) : [],
  BrandModalNumberData: storedData ? JSON.parse(storedData) : [],
  MobileNumberData: storedData ? JSON.parse(storedData) : [],
};

const MobileNumberSlice = createSlice({
  name: "MobileNumberSlice",
  initialState,
  reducers: {
    Remove: (state, action) => {
      return {
        ...state,
        AllModalNumberData: state.AllModalNumberData.filter(item => item.id !== action.payload)
      }
    },
    // ✅ FIXED: Consistent restore function
    restore: (state) => {
      return {
        ...state,
        Edit: {
          modalNumber: {
            id: 0,
            name: "",
            brand: {
              id: 0,
              name: "",
              is_deleted: null
            },
            categories: {
              id: 0,
              name: "",
              is_deleted: null
            },
            subCategory: {
              id: 0,
              name: "",
              category: {
                id: 0,
                name: "",
                is_deleted: null
              },
              is_deleted: null
            },
            productSpecification: {
              id: 0,
              ram: "",
              rom: "",
              network: "",
              platform: ""
            },
            is_deleted: null
          },
          isEdit: false
        }
      };
    },
    // ✅ IMPROVED: Update action with payload validation
    Update: (state, action) => {
      const payload = action.payload;
      if (payload && typeof payload === 'object') {
        return {
          ...state,
          Edit: {
            modalNumber: {
              id: payload.id || 0,
              name: payload.name || "",
              brand: {
                id: payload.brand?.id || 0,
                name: payload.brand?.name || "",
                is_deleted: payload.brand?.is_deleted || null
              },
              categories: {
                id: payload.categories?.id || 0,
                name: payload.categories?.name || "",
                is_deleted: payload.categories?.is_deleted || null
              },
              subCategory: {
                id: payload.subCategory?.id || 0,
                name: payload.subCategory?.name || "",
                category: payload.subCategory?.category ? {
                  id: payload.subCategory.category.id || 0,
                  name: payload.subCategory.category.name || "",
                  is_deleted: payload.subCategory.category.is_deleted || null
                } : null,
                is_deleted: payload.subCategory?.is_deleted || null
              },
              productSpecification: {
                id: payload.productSpecification?.id || 0,
                ram: payload.productSpecification?.ram || "",
                rom: payload.productSpecification?.rom || "",
                network: payload.productSpecification?.network || "",
                platform: payload.productSpecification?.platform || ""
              },
              is_deleted: payload.is_deleted || null
            },
            isEdit: true
          }
        }
      }
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchAllModalNumber.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(FetchAllModalNumber.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.AllModalNumberData = action.payload
      })
      .addCase(FetchAllModalNumber.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Modal Number Fetched Failed -----------", action.payload)
      })

      // Create
      .addCase(CreateModalNumber.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(CreateModalNumber.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.AllModalNumberData = [...state.AllModalNumberData, action.payload]
        console.log("Created Modal Number Data :--------", action.payload)
      })
      .addCase(CreateModalNumber.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Modal Number Creation Failed -----------", action.payload)
      })

      // Get Modal Number by Brand Id
      .addCase(FetchBrandIdModalNumber.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(FetchBrandIdModalNumber.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.BrandModalNumberData = action.payload
      })
      .addCase(FetchBrandIdModalNumber.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Modal Number Data by Brand Id Fetched Failed:", action.payload?.message);
      })

      // ✅ ADDED: Update Modal Number Cases
      .addCase(UpdateModalNumber.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(UpdateModalNumber.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        // Update the item in AllModalNumberData array
        const updatedIndex = state.AllModalNumberData.findIndex(
          item => item.id === action.payload.id
        );
        if (updatedIndex !== -1) {
          state.AllModalNumberData[updatedIndex] = action.payload;
        }
        // Reset edit state after successful update
        state.Edit = {
          modalNumber: initialState.Edit.modalNumber,
          isEdit: false
        };
        console.log("Updated Modal Number Data:", action.payload)
      })
      .addCase(UpdateModalNumber.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Modal Number Update Failed:", action.payload)
      })

      // fetch by sub-category
      .addCase(FetchModalBySubCategory.pending, (state, action) =>{
        state.isLoading = true
        state.isSuccess = false
        console.log("Fetching Data is Pending :---", action.payload)
      })
      .addCase(FetchModalBySubCategory.fulfilled, (state, action) =>{
        state.isLoading = false
        state.isSuccess = true
        state.MobileNumberData = action.payload
      })
      .addCase(FetchModalBySubCategory.rejected, (state, action) =>{
        state.isLoading = false
        state.isSuccess = false
        console.log("Product Model Number Data Fetch by Sub-Category id is Rejected :--", action.payload)
      })

      // fetch view-variant
      .addCase(ViewVariantData.pending, (state, action) =>{
        state.viewVariant.isLoading = true
        state.viewVariant.isSuccess = false
        console.log("View-Variant Data is Pending :---", action.payload)
      })
      .addCase(ViewVariantData.fulfilled, (state, action) =>{
        state.viewVariant.isLoading = false
        state.viewVariant.isSuccess = true
        state.viewVariant.data = action.payload
      })
      .addCase(ViewVariantData.rejected, (state, action) =>{
        state.viewVariant.isLoading = false
        state.viewVariant.isSuccess = false
        console.log("View-Variant Data Fetching is Rejected with :--", action.payload)
      })

  }
})

export default MobileNumberSlice.reducer
export const { Remove, Update, restore } = MobileNumberSlice.actions

// Fetch All Modal-Number Thunk
export const FetchAllModalNumber = createAsyncThunk("FETCH/ALL/MODAL-NUMBER", async (_, thunkAPI) => {
  try {
    const response = await getRequestMethod(UrlConstants.GET_ALL_MODAL_NUMBER)
    return response
  } catch (error: any) {
    const message = error.response.data.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Create Modal-Number Thunk
export const CreateModalNumber = createAsyncThunk("CREATE/MODAL-NUMBER", async (requestData, thunkAPI) => {
  console.log(requestData)
  try {
    const response = await postRequestMethod(requestData, UrlConstants.ADD_MODAL_NUMBER)
    console.log(response)
    return response
  } catch (error: any) {
    const message = error.response.data.message
    return thunkAPI.rejectWithValue(message)
  }
})

// ✅ FIXED: Update Modal-Number Thunk with proper typing
export const UpdateModalNumber = createAsyncThunk(
  "UPDATE/MODAL-NUMBER",
  async (id: string | number, thunkAPI) => {
    try {
      // ✅ FIXED: Proper type casting for getState
      const state = thunkAPI.getState() as { MobileNumberSlice: MobileNumber };
      const updateData = state.MobileNumberSlice.Edit.modalNumber;

      if (!updateData || !updateData.name) {
        return thunkAPI.rejectWithValue("No Data To Update!!!");
      }

      // ✅ FIXED: Proper payload structure
      const payload = {
        name: updateData.name,
        categoryName: updateData.categories.name,
        subCategoryName: updateData.subCategory.name,
        subCategoryCategoryName: updateData.subCategory.category?.name || "",
        brandName: updateData.brand.name,
        ram: updateData.productSpecification.ram,
        rom: updateData.productSpecification.rom,
        network: updateData.productSpecification.network,
        platform: updateData.productSpecification.platform
      };

      console.log("Update Payload:", payload);

      const response = await putRequestMethodWithBodyAndParam(
        payload,
        UrlConstants.UPDATE_MODAL_NUMBER,
        id.toString()
      );

      console.log("Update Response:", response);
      return response;
    } catch (error: any) {
      console.error("UpdateModalNumber Error:", error);
      const message = error?.response?.data?.message || error?.message || "Failed to Update modal number";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// getRequestMethod with URL parameter (ALTERNATIVE)
export const FetchBrandIdModalNumber = createAsyncThunk(
  'mobileNumber/fetchByBrandId',
  async (brandId: number | string, { rejectWithValue }) => {
    try {
      console.log("Fetching models for brandId:", brandId);
      const response = await getRequestMethod(`${UrlConstants.GET_ALL_MODAL_NUMBER_BY_ID}/${brandId}`);
      
      console.log("Brand models response:", response);
      return response;
      
    } catch (error: any) {
      console.error("Brand fetch error:", error);
      return rejectWithValue(error.message || "Failed to fetch brand models");
    }
  }
);

// Fetch Modal by Sub-Category Thunk
export const FetchModalBySubCategory = createAsyncThunk(
  "FETCH/MODAL/NUMBER/BY/SUB-CATEGORY/ID",
  async (id: any, thunkAPI) => {
    try {
      const response = await getRequestMethodWithParam(
        { id },  // <-- params object
        UrlConstants.GET_MODAL_NUMBER_BY_SC_ID
      );
      console.log("Response Data :--", response);
      return response;
    } catch (error: any) {
      console.error("Modal fetch error:", error);
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch modal numbers");
    }
  }
);

// view-variant thunk
export const ViewVariantData = createAsyncThunk("VIEW/VARINAT/DATA", async (id:number, thunkAPI) =>{
  try {
    const response = await getRequestMethod( `${UrlConstants.GET_VIEW_VARIANT}/${id}`);
    console.log("Response Data :--", response);
    return response
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
  }
})