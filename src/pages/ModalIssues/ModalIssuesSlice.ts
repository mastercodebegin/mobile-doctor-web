import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, getRequestMethodWithParam, postRequestMethod, putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.MODAL_ISSUE);

interface Category {
  id: number;
  name: string;
  is_deleted: boolean;
}

interface SubCategory {
  id: number;
  name: string;
  category: Category;
  is_deleted: boolean;
}

interface User {
  id: number;
  name: string;
  subCategory: SubCategory;
  deleted: boolean;
}

interface ModalIssues {
  isLoading: boolean;
  isSuccess: boolean;
  ModalIssuesData: User[];
  Edit: { modalIssue: User, isEdit: boolean }
}

const initialState: ModalIssues = {
  isLoading: false,
  isSuccess: false,
  ModalIssuesData: storeData || [],
  Edit: {
    modalIssue: {
      id: 0,
      name: "",
      deleted: false,
      subCategory: {
        id: 0,
        name: "",
        is_deleted: false,
        category: {
          id: 0,
          name: "",
          is_deleted: false
        }
      }
    },
    isEdit: false
  }
}

const ModalIssuesSlice = createSlice({
  name: 'ModalIssuesSlice',
  initialState,
  reducers: {
    restore: () => {
      const storeData = localStorage.getItem('modal-issues')
      return {
        isLoading: false,
        isSuccess: false,
        ModalIssuesData: storeData ? JSON.parse(storeData) : [],
        Edit: { modalIssue: { name: "" }, isEdit: false }
      }
    },
    resetEdit: (state) => {
      state.Edit = {
        isEdit: false,
        modalIssue: {
          id: 0,
          name: "",
          deleted: false,
          subCategory: {
            id: 0,
            name: "",
            is_deleted: false,
            category: {
              id: 0,
              name: "",
              is_deleted: false
            }
          }
        }
      };
    },
    Remove: (state, action) => {
      const updateModalIssueData = state.ModalIssuesData.filter(item => item.id !== action.payload)
      LocalStorageManager.saveData(STORAGE_KEYS.MODAL_ISSUE, updateModalIssueData)
      return {
        ...state,
        ModalIssuesData: updateModalIssueData
      }
    },
    Update: (state, action) => {
      state.Edit = { modalIssue: action.payload, isEdit: true }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllModalIssues.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(GetAllModalIssues.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        if (action.payload && action.payload.length > 0) {
          state.ModalIssuesData = action.payload
          LocalStorageManager.saveData(STORAGE_KEYS.MODAL_ISSUE, action.payload);
        }
      })
      .addCase(GetAllModalIssues.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Modal-Issue's Data Fetch Failed :----", action.payload)
      })

      // Fetch By Id
      .addCase(GetAllProductPartsBySubCategory.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(GetAllProductPartsBySubCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ModalIssuesData = action.payload
        LocalStorageManager.saveData(STORAGE_KEYS.MODAL_ISSUE, action.payload);
        
      })
      .addCase(GetAllProductPartsBySubCategory.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Modal-Issue's Data By Sub-Category Id Fetch Failed :----", action.payload)
      })

      // Create
      .addCase(CreateModalIssue.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(CreateModalIssue.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ModalIssuesData.push(action.payload)
        LocalStorageManager.saveData(STORAGE_KEYS.MODAL_ISSUE, [...state.ModalIssuesData]);
      })
      .addCase(CreateModalIssue.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Modal-Issue's Data Creation Failed :----", action.payload)
      })

      // Update
      .addCase(UpdateModalIssue.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(UpdateModalIssue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const updatedItem = action.payload;

        const itemIndex = state.ModalIssuesData.findIndex(
          (item) => item.id === updatedItem.id
        );

        if (itemIndex !== -1) {
          state.ModalIssuesData[itemIndex] = updatedItem;
        }

        // Sync to localStorage
        LocalStorageManager.saveData(STORAGE_KEYS.MODAL_ISSUE, [...state.ModalIssuesData]);

        // Reset Edit state
        state.Edit = {
          isEdit: false,
          modalIssue: {
            id: 0,
            name: "",
            deleted: false,
            subCategory: {
              id: 0,
              name: "",
              is_deleted: false,
              category: {
                id: 0,
                name: "",
                is_deleted: false
              }
            }
          }
        };
      })
      .addCase(UpdateModalIssue.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Modal-Issue Data Updation Failed :--", action.payload)
      })

      // Delete
      .addCase(DeleteProductPart.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
      })
      .addCase(DeleteProductPart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ModalIssuesData = state.ModalIssuesData.filter((item) => item.id !== action.payload)
        localStorage.setItem('modal-issues', JSON.stringify(state.ModalIssuesData));
      })
      .addCase(DeleteProductPart.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        console.log("Modal-Issue Data Deleted Failed :--", action.payload)
      })
  }
})


export default ModalIssuesSlice.reducer
export const { restore, Remove, Update, resetEdit } = ModalIssuesSlice.actions


// Fetch All Modal-Issue's Thunk
export const GetAllModalIssues = createAsyncThunk("FETCH/MODAL-ISSUE'S", async (_, thunkAPI) => {
  try {
    const response = await getRequestMethod(UrlConstants.GET_ALL_PRODUCT_PART_LABEL)
    console.log("Response To Fetch All Modal-Issue's", response);
    return response
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Fetch All Product-Part's by Sub-Category Id
export const GetAllProductPartsBySubCategory = createAsyncThunk("FETCH/PRODUCT-PART'S/BY/SUB-CATEGORY/ID", async (requestParam: string, thunkAPI) => {
  try {
    const param = {
      subCategoryId: requestParam
    }
    const response = await getRequestMethodWithParam(param, UrlConstants.GET_PRODUCT_PART_LABEL_BY_SUB_CATEGORY_ID)
    console.log("Response To Fetch All Modal-Issue's By Sub-Category Id", response);
    return response
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})


// Create Modal-Issue Thunk
export const CreateModalIssue = createAsyncThunk("CREATE/MODAL-ISSUE", async (requestData, thunkAPI) => {
  try {
    const response = await postRequestMethod(requestData, UrlConstants.ADD_PRODUCT_PART_LABEL);
    console.log("Response To Create Modal-Issue :", response);
    return response
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Update Modal-Issue Thunk
export const UpdateModalIssue = createAsyncThunk("UPDATE/MODAL-ISSUE", async (id: string, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as any;
    const updateData = state.ModalIssuesSlice?.Edit?.modalIssue;

    if (!updateData || !updateData.name) {
      return thunkAPI.rejectWithValue("No Data to Update!!")
    }

    const requestBody = {
      id: id,
      name: updateData.name,
      deleted: updateData.deleted,
      subCategory: {
        id: updateData.subCategory.id,
        name: updateData.subCategory.name,
        is_deleted: updateData.subCategory.is_deleted,
        category: {
          id: updateData.subCategory.category.id,
          name: updateData.subCategory.category.name,
          is_deleted: updateData.subCategory.category.is_deleted
        }
      }
    };


    const response = await putRequestMethod(
      requestBody,
      UrlConstants.UPDATE_PRODUCT_PART_LABEL
    );
    console.log("Response To Update Modal-Issue :", response)
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})


// Delete Product-Part Thunk
export const DeleteProductPart = createAsyncThunk("DELETE/PRODUCT-PART", async (id: string, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as any;
    const itemToDelete = state.ModalIssuesSlice.ModalIssuesData.find((item: any) => item.id === parseInt(id));

    if (!itemToDelete) {
      return thunkAPI.rejectWithValue("Item not found!");
    }

    const requestBody = {
      id: id,
      name: itemToDelete.name,
      deleted: true,
      subCategory: {
        id: itemToDelete.subCategory.id,
      }
    };

    const response = await putRequestMethod(
      requestBody,
      UrlConstants.UPDATE_PRODUCT_PART_LABEL
    );

    console.log("Response To Delete Modal-Issue:", response);
    return parseInt(id);
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});