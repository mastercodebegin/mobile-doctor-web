import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequestMethod, putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.ORDERS);

interface IEditOrder {
  unitRepairStatus: "PENDING" | "COMPLETED" | "CANCELLED" | string;
  orderId: string;
  defectDescriptionByEngineer: string;
  price: string;
  orderCompletedOn: string;
}

interface EditOrder {
  isEdit: boolean;
  order: IEditOrder | null;
}

export interface OrdersState {
  isLoading: boolean;
  isSuccess: boolean;
  Orders: any[]; 
  Edit:EditOrder
}

const initialState = {
    isLoading: false,
    isSuccess: false,
    Orders: storeData,
     Edit: {
    isEdit: false,
    order: {
      unitRepairStatus: "PENDING",
      orderId: "",
      defectDescriptionByEngineer: "",
      price: "",
      orderCompletedOn: "",
    },
  },
}

const OrderSlice = createSlice({
    name: 'OrderSlice',
    initialState,
    reducers: {
        update: (state, action) => {
            state.Edit.order = action.payload;
            state.Edit.isEdit = true;
        }
    },

    extraReducers: (builder) =>{
        builder
         // Fetch By Id
                .addCase(GetAllRepairUnitOrderByUserId.pending, (state, action) =>{
                    state.isLoading = true
                    state.isSuccess = false
                    console.log("Data Fetching Pending ----", action.payload)
                })
                .addCase(GetAllRepairUnitOrderByUserId.fulfilled, (state, action) =>{
                    state.isLoading = false
                    state.isSuccess = true
                    state.Orders = action.payload?.content;
                    LocalStorageManager.saveData(STORAGE_KEYS.ORDERS, action.payload);
                })
                .addCase(GetAllRepairUnitOrderByUserId.rejected, (state, action) =>{
                    state.isLoading = false
                    state.isSuccess = false
                    console.log("All Repair Unit Order By User Id Data Fetching Failed :--", action.payload)
                })     
                
                // Update
                .addCase(UpdateOrder.pending, (state, action) =>{
                    state.isLoading = true
                    state.isSuccess = false
                    console.log("Update Order is Pending :--", action.payload)
                })
      .addCase(UpdateOrder.fulfilled, (state, action) => {
              state.isLoading = false;
              state.isSuccess = true;
              console.log("Update fulfilled payload:", action.payload);
              const updatedItem = action.payload;
              if (updatedItem && updatedItem.orderId) {
                const itemIndex = state.Orders.findIndex((item) => item.id === updatedItem.orderId);

                if (itemIndex !== -1) {
                  const originalItem = state.Orders[itemIndex];

                  state.Orders[itemIndex] = {
                     ...originalItem,
                     ...updatedItem,
                      defectDescriptionByEngineer: updatedItem.defectDescriptionByEngineer || originalItem.defectDescriptionByEngineer,
                      price: updatedItem.price || originalItem.price,
                  };

                  console.log("✅ Order updated at index", itemIndex);
                }
              }

              LocalStorageManager.saveData(STORAGE_KEYS.ORDERS, [...state.Orders]);

              state.Edit = {
                 isEdit: false,
                 order: initialState.Edit.order,
              };

              console.log("Updated Order Data:", state.Orders);
          })
                 .addCase(UpdateOrder.rejected, (state, action) =>{
                        state.isLoading = false
                        state.isSuccess = false
                        console.log("Order Data Updted Failed :--", action.payload)
                      })
    }
})


export default OrderSlice.reducer;
export const {update} = OrderSlice.actions;

// Fetch All Repair Unit Order By User Id
export const GetAllRepairUnitOrderByUserId = createAsyncThunk("FETCH/ALL/REPAIR/UNIT/ORDER/BY/USER/ID", async (data:any, thunkAPI) =>{
    try {
        const response = await postRequestMethod(data, UrlConstants.GET_ALL_REPAIR_UNIT_ORDER_BY_USER_ID);
        console.log("Response Data To Fetch All Repair Unit Order By User Id :---", response);
        return response;
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})

// // Update Order Thunk
export const UpdateOrder = createAsyncThunk("UPDATE/ORDER", async (actionData, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as any;
    const updateData = state.OrderSlice.Edit.order;

    if (!updateData || !updateData.price) {
      return thunkAPI.rejectWithValue("No Data To Update!");
    }

    const requestBody = {
      unitRepairStatus: updateData.unitRepairStatus,
      orderId: updateData.orderId,
      description: updateData.defectDescriptionByEngineer,
      price: updateData.price,
      orderCompletedOn: updateData.orderCompletedOn
    };

    console.log("🛠️ Update payload being sent:", requestBody);
    console.log("🛠️ orderCompletedOn value:", updateData.orderCompletedOn);

    const response = await putRequestMethod(requestBody, UrlConstants.UPDATE_ORDER);
    console.log("✅ Response Data By Update:", response);

    return response;
  } catch (error: any) {
    const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to Update Order";

    console.error("❌ UpdateOrder Error:", message);
    return thunkAPI.rejectWithValue(message);
  }
});