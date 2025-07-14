import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, getRequestMethodWithParam, postRequestMethod, putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

const storeData = localStorage.getItem('product-part')

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


interface ProductPart {
    id: number;
    name: string;
    subCategory: SubCategory;
    deleted: boolean;
}

interface Role {
id: number;
name: string;
}

interface UserInterface {
    id: number;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    personalEmail: string;
    password: string;
    createdAt: string;
    deviceToken: string;
    role: Role;
}

interface ProductPartRecord {
  id: number;
  quantity: number;
  notes: string;
  productPart: ProductPart;
  user: UserInterface;
  deleted: boolean;
}


interface ProductPartInterface {
    isLoading: boolean;
    isSuccess: boolean;
    ProductPartData: ProductPartRecord[];
    Edit: {inventory: ProductPartRecord, isEdit: boolean};
}

const initialState: ProductPartInterface = {
    isLoading: false,
    isSuccess: false,
    ProductPartData: storeData ? JSON.parse(storeData) : [],
    Edit: {
        isEdit: false,
        inventory: {
            id: 0,
            quantity: 0,
            notes: "",
            deleted: false,
            productPart: {
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
            user: {
  id: 0,
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
        personalEmail: "",
        password: "",
        createdAt: "",
        deviceToken: "",
        role: {
          id: 0,
          name: ""
        }
            },
        }
    }
}

const ProductPartSlice = createSlice({
    name: 'InventorySlice',
    initialState,
    reducers: {
      restore: () => {
  const storeData = localStorage.getItem('product-part');
  return {
    isLoading: false,
    isSuccess: false,
    ProductPartData: storeData ? JSON.parse(storeData) : [],
    Edit: { inventory : {quantity: 0, notes: "", productPart: null}, isEdit: false}
  };
},
Update: (state,action) =>{
    state.Edit = {inventory: action.payload, isEdit: true}
}

    },
    extraReducers: (builder) => {
        builder
        .addCase(GetAllProductPart.pending, (state, action) =>{
            state.isLoading = true
            state.isSuccess = false
            console.log("Data Fetching Pending ----", action.payload)
        })
        .addCase(GetAllProductPart.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.ProductPartData = action.payload
        })
        .addCase(GetAllProductPart.rejected, (state, action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("Product-Part Data Fetching Failed :--", action.payload)
        })

        // Fetch By Id
        .addCase(GetAllProductPartBySubCategoryId.pending, (state, action) =>{
            state.isLoading = true
            state.isSuccess = false
            console.log("Data Fetching Pending ----", action.payload)
        })
        .addCase(GetAllProductPartBySubCategoryId.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.ProductPartData = action.payload
        })
        .addCase(GetAllProductPartBySubCategoryId.rejected, (state, action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("Product-Part Data Fetching Failed :--", action.payload)
        })

        // Create
        .addCase(CreateInventory.pending, (state, action) =>{
            state.isLoading = true
            state.isSuccess = false
            console.log("Inventory Creating is Pending :--", action.payload)
        })
        .addCase(CreateInventory.fulfilled, (state, action) =>{
state.isLoading = false
state.isSuccess = true
state.ProductPartData = [...state.ProductPartData, action.payload]
        })
        .addCase(CreateInventory.rejected, (state, action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("Inventory Data Creation Failed :--", action.payload)
        })

        // Delete
        .addCase(DeleteInventory.pending, (state,action) =>{
             state.isLoading = true
        state.isSuccess = false
        console.log("Inventory Data Delete Pending :--", action.payload)
        })
        .addCase(DeleteInventory.fulfilled, (state,action) =>{
            state.isLoading = false;
        state.isSuccess = true;
        state.ProductPartData = state.ProductPartData.filter((item) => item.id !== action.payload)
        localStorage.setItem('product-part', JSON.stringify(state.ProductPartData))
        })
        .addCase(DeleteInventory.rejected, (state,action) =>{
             state.isLoading = false
        state.isSuccess = false
        console.log("Inventory Data Deleted Failed :--", action.payload)
        })

        // Update
        .addCase(UpdateInventory.pending, (state,action) =>{
             state.isLoading = true
        state.isSuccess = false
        console.log("Inventory Updating is Pending :---", action.payload)
        })
        .addCase(UpdateInventory.fulfilled, (state,action) =>{
            state.isLoading = false;
        state.isSuccess = true;

        const updatedItem = action.payload;

        const itemIndex = state.ProductPartData.findIndex((item) => item.id === updatedItem.id);
        if(itemIndex !== -1) {
            state.ProductPartData[itemIndex] = updatedItem;
        }

         // Sync to localStorage
        localStorage.setItem('product-part', JSON.stringify(state.ProductPartData));

        // Reset Edit State
        state.Edit = initialState.Edit
        })
         .addCase(UpdateInventory.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                console.log("Inventory Data Updation Failed :--", action.payload)
              })
    }
})


export default ProductPartSlice.reducer
export const {restore, Update} = ProductPartSlice.actions

// Fetch All Product-Part
export const GetAllProductPart = createAsyncThunk("FETCH/ALL/PRODUCT-PART", async (_, thunkAPI) =>{
    try {
        const response = await getRequestMethod(UrlConstants.GET_ALL_INVENTORY);
        console.log("Response Data To Fetch All Product-Part's", response);
        return response
    } catch (error: any) {
    const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})


// Fetch All Product-Part By Sub-Category Id
export const GetAllProductPartBySubCategoryId = createAsyncThunk("FETCH/PRODUCT-PRODUCT/BY/SUB-CATEGORY/ID", async (requestParam: any, thunkAPI) =>{
    try {
        const response = await getRequestMethodWithParam(requestParam, UrlConstants.GET_ALL_INVENTORY);
        console.log("Response Data To Fetch All Product-Part's By Id :---", response);
        return response;
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})

// Create
export const CreateInventory = createAsyncThunk("CREATE/INVENTORY", async (requestData, thunkAPI) =>{
    try {
        const response = await postRequestMethod(requestData, UrlConstants.ADD_INVENTORY);
        console.log("Response To Create Inventory :", response);
        return response
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
}) 

// Update
export const UpdateInventory = createAsyncThunk(
  "UPDATE/INVENTORY", 
  async (updatePayload: { id: string, updateData: any }, thunkAPI) => {
    try {
      const { id, updateData } = updatePayload;
      
      if(!updateData || !updateData.quantity) {
        return thunkAPI.rejectWithValue("No Data To Update!");
      }

      const requestBody = {
        id: id,
        quantity: updateData.quantity,
        notes: updateData.notes,
        deleted: false,
        productPart: {
          id: updateData.productPart.id,
          name: updateData.productPart.name,
          deleted: updateData.productPart.deleted,
          subCategory: {
            id: updateData.productPart.subCategory.id,
            name: updateData.productPart.subCategory.name,
            is_deleted: updateData.productPart.subCategory.is_deleted,
            category: {
              id: updateData.productPart.subCategory.category.id,
              name: updateData.productPart.subCategory.category.name,
              is_deleted: updateData.productPart.subCategory.category.is_deleted
            }
          }
        },
        user: {
          id: updateData.user.id,
          firstName: updateData.user.firstName,
          lastName: updateData.user.lastName,
          mobile: updateData.user.mobile,
          email: updateData.user.email,
          personalEmail: updateData.user.personalEmail,
          password: updateData.user.password,
          createdAt: updateData.user.createdAt,
          deviceToken: updateData.user.deviceToken,
          role: {
            id: updateData.user.role.id,
            name: updateData.user.role.name
          }
        }
      };

      console.log("RequestBody Response Data :--", requestBody);

      const response = await putRequestMethod(
        requestBody,
        UrlConstants.UPDATE_INVENTORY
      );
      
      console.log("Response To Update Inventory :--", response);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete
export const DeleteInventory = createAsyncThunk("DELETE/INVENTORY", async (id: string, thunkAPI) =>{
    try {
        const state = thunkAPI.getState() as any;
        const itemToDelete = state.InventorySlice.ProductPartData.find((item: any) => item.id === parseInt(id));

        if(!itemToDelete) {
            return thunkAPI.rejectWithValue("Item Not Found!");
        }

        const requestBody = {
            id: id,
            quantity: itemToDelete.quantity,
            notes: itemToDelete.notes,
            productPart: itemToDelete.ProductPart
        }

        const response = await putRequestMethod(requestBody, UrlConstants.UPDATE_INVENTORY);
        console.log("Response To Delete Inventory :--", response);
        return parseInt(id);
    } catch (error: any) {
          const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})