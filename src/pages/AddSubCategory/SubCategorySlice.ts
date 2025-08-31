import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, postRequestMethod, putRequestMethodWithBodyAndParam } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.SUB_CATEGORY);

interface User {
  id: string | number;
  name: string;
  category: {
    id: number;
    name: string;
    is_deleted: string;
  } | null;
}

interface SubCategory {
  isLoading: boolean;
  isSuccess: boolean;
  SubCategoriesData: User[];
  Edit: {
    subCategory: User | {
      name: string;
      category: {
        id: string;
        name: string;
        is_deleted: string
      } | null
    };
    isEdit: boolean;
  };
}


const initialState: SubCategory = {
  isLoading: false,
  isSuccess: false,
  SubCategoriesData: storeData,
  Edit: {
    subCategory: {
      id: "",
      name: '',
      category: {
        id: '',
        name: '',
        is_deleted: ''
      }
    },
    isEdit: false
  }
};



const SubCategorySlice = createSlice({
  name: "SubCategorySlice",
  initialState,
  reducers: {
    Remove: (state, action) => {
      const updatedSubCategoryData = state.SubCategoriesData.filter(item => item.id !== action.payload);
      LocalStorageManager.saveData(STORAGE_KEYS.SUB_CATEGORY, updatedSubCategoryData)
      return {
        ...state,
        SubCategoriesData: updatedSubCategoryData
      }
    },
    restore: (state) => {
      return {
        ...state,
        Edit: {
          subCategory: {
            name: "",
            category: null
          },
          isEdit: false
        }
      };
    },
    Update: (state, action) => {
      // action.payload = user object
      return {
        ...state,
        Edit: {
          subCategory: action.payload,
          isEdit: true
        }
      };
    }


  },
  extraReducers: (builder) => {
    builder

      // Get
      .addCase(GetAllSubCategory.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(GetAllSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.SubCategoriesData = action.payload
        LocalStorageManager.saveData(STORAGE_KEYS.SUB_CATEGORY, action.payload);
      })
      .addCase(GetAllSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        console.log("Add Category fetch Failed ----------", action.payload)
      })

      // Create
      .addCase(CreateSubCategory.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(CreateSubCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.SubCategoriesData = [...state.SubCategoriesData, action.payload]
        LocalStorageManager.saveData(STORAGE_KEYS.SUB_CATEGORY, [...state.SubCategoriesData]);
      })
      .addCase(CreateSubCategory.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Sub Category Not Created --------------", action.payload)
      })

      // Update
      .addCase(UpdateSubCategory.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(UpdateSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        console.log("Update fulfilled payload:", action.payload);

        // Get updated data from Edit state
        const updatedId = state.Edit.subCategory?.id;
        const updatedName = state.Edit.subCategory?.name;
        const updatedCategory = state.Edit.subCategory?.category;

        if (updatedId) {
          state.SubCategoriesData = state.SubCategoriesData?.map((sub) =>
            sub.id === updatedId ? {
              ...sub,
              name: updatedName,
              category: updatedCategory
            } : sub
          );
        }
        LocalStorageManager.saveData(STORAGE_KEYS.SUB_CATEGORY, [...state.SubCategoriesData]);

        // Clear edit state
        state.Edit = {
          subCategory: { name: "", category: null },
          isEdit: false
        };
      })


      .addCase(UpdateSubCategory.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Update SubCategory failed : ", action.payload)
      })
  }

})


export default SubCategorySlice.reducer
export const { Remove, restore, Update } = SubCategorySlice.actions


// Get All sub-Category Thunk
export const GetAllSubCategory = createAsyncThunk("FETCH/SUBCATEGORYS", async (_, thunkAPI) => {
  try {
    const response = await getRequestMethod(UrlConstants.GET_ALL_SUB_CATEGORY)
    console.log(response)
    return response
  } catch (error: any) {
    const message = error.response.data.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Get All Sub-Category By Category Id Thunk
export const GetAllSubCategoryById = createAsyncThunk("FETHC/SUBCATEGORY/BY/CATEGORY/ID", async (requestParam, thunkAPI) =>{
  try {
    const response = await getRequestMethod(`${UrlConstants.GET_ALL_SUB_CATEGORY_BY_CATEGORY_IDE}${requestParam}`)
    console.log(response);
    return response
  } catch (error: any) {
     const message = error.response.data.message
    return thunkAPI.rejectWithValue(message)
  }
})



// Create Sub-Category Thunk
export const CreateSubCategory = createAsyncThunk("CREATE/SUBCATEGORY", async (requestData, thunkAPI) => {
  try {
    const response = await postRequestMethod(requestData, UrlConstants.ADD_SUB_CATEGORY)
    console.log(response)
    return response
  } catch (error: any) {
    const message = error.response.data.message
    return thunkAPI.rejectWithValue(message)
  }
})


// Update Sub-Category Thunk
export const UpdateSubCategory = createAsyncThunk("UPDATE/SUBCATEGORY", async (id: string, thunkAPI) => {
  try {
    const updateData = thunkAPI.getState().SubCategorySlice?.Edit?.subCategory;
    console.log(updateData)

    if (!updateData) return thunkAPI.rejectWithValue("No Data to Update!!")

    const payload = {
      name: updateData.name,
      categoryObj: updateData?.category?.name,
    }

    console.log(payload)
    const response = await putRequestMethodWithBodyAndParam(
      payload,
      UrlConstants.UPDATE_SUB_CATEGORIE,
      id
    )
    console.log("Update response:", response)
    return response
  } catch (error: any) {
    const message = error.response.data.message
    return thunkAPI.rejectWithValue(message)
  }
})