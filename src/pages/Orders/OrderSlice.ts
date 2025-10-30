import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequestMethod, putRequestMethod, putRequestMethodForDownload, putRequestMethodWithParam } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.ORDERS);

interface IEditOrder {
  unitRepairStatus: "PENDING" | "COMPLETED" | "CANCELLED" | string;
  orderId: string;
  defectDescriptionByEngineer: string;
  price: string;
  orderCompletedOn: string;
  delayReason: string;
}

interface EditOrder {
  isEdit: boolean;
  order: IEditOrder | null;
}

export interface OrdersState {
  isEmailLoading: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  Orders: any[]; 
  FindUsers: any[];
  Edit:EditOrder
}

const initialState = {
  isEmailLoading: false,
    isLoading: false,
    isSuccess: false,
    Orders: storeData,
    FindUsers: storeData || [],
     Edit: {
    isEdit: false,
    order: {
      unitRepairStatus: "PENDING",
      orderId: "",
      defectDescriptionByEngineer: "",
      price: "",
      expectedCompletedOn: "",
      delayReason: "",
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
         // Fetch By Id & Filter
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
                
                // Download Orders
                .addCase(DownloadOrders.pending, (state, action) =>{
                    state.isLoading = true
                    state.isSuccess = false
                    console.log("Data Download is Pending ----", action.payload)
                })
                .addCase(DownloadOrders.fulfilled, (state, action) =>{
                    state.isLoading = false
                    state.isSuccess = true
                    console.log("Response Data :----", action.payload)
                    // state.Orders = action.payload?.content;
                    // LocalStorageManager.saveData(STORAGE_KEYS.ORDERS, action.payload);
                })
                .addCase(DownloadOrders.rejected, (state, action) =>{
                    state.isLoading = false
                    state.isSuccess = false
                    console.log("Download Repair Unit Order By User Id Data Fetching Failed :--", action.payload)
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
  
  const response = action.payload;
  console.log("✅ Update API Response:", response);
  
  // Check if response has data
  if (!response || !response.orderId) {
    console.error("❌ Invalid response from update API");
    return;
  }
  
  // Find and update order
  const orderIndex = state.Orders.findIndex(
    (order) => order.orderId === response.orderId
  );
  
  if (orderIndex !== -1) {
    // Create updated order object
    state.Orders[orderIndex] = {
      ...state.Orders[orderIndex],
      // Update with response data (handle different field names)
      unitRepairStatus: response.unitRepairStatus || state.Orders[orderIndex].unitRepairStatus,
      price: response.price || state.Orders[orderIndex].price,
      defectDescriptionByEngineer: response.engDefectDescription || response.defectDescriptionByEngineer || state.Orders[orderIndex].defectDescriptionByEngineer,
      expectedCompletedOn: response.orderExpectedCompletedOn || response.expectedCompletedOn || state.Orders[orderIndex].expectedCompletedOn,
      delayReason: response.delayReason !== undefined ? response.delayReason : state.Orders[orderIndex].delayReason,
    };
    
    console.log("✅ Order updated successfully at index:", orderIndex);
    console.log("✅ Updated Order Data:", state.Orders[orderIndex]);
    
    // Save to localStorage
    LocalStorageManager.saveData(STORAGE_KEYS.ORDERS, state.Orders);
  } else {
    console.error("❌ Order not found with orderId:", response.orderId);
  }
  
  // Reset edit state
  state.Edit = {
    isEdit: false,
    order: { ...initialState.Edit.order },
  };
})
                 .addCase(UpdateOrder.rejected, (state, action) =>{
                        state.isLoading = false
                        state.isSuccess = false
                        console.log("Order Data Updted Failed :--", action.payload)
                      })

                      // Find User
                      .addCase(FindUserByEmail.pending, (state, action) =>{
                        state.isLoading = false
                        state.isEmailLoading = true
                        state.isSuccess = false
                        console.log("Data Fetching is Pending :----", action.payload);
                      })
                      .addCase(FindUserByEmail.fulfilled, (state, action) =>{
                        state.isLoading = false
                        state.isEmailLoading = false
                        state.isSuccess = true
                        state.FindUsers = action.payload
                      })
                      .addCase(FindUserByEmail.rejected, (state, action) =>{
                        state.isLoading = false
                        state.isEmailLoading = false
                        state.isSuccess = false
                        console.log("Find User By Email Data Fetching Failed :---", action.payload)
                      })

                      // Assign Engineer 
                      .addCase(AssignToEngineer.pending, (state, action) =>{
                        state.isLoading = true
                        state.isSuccess = false
                        console.log("Data Fetching is Pending :-----", action.payload)
                      })
                      .addCase(AssignToEngineer.fulfilled, (state ,action) =>{
                        state.isLoading = false
                        state.isSuccess = true
                        state.FindUsers = action.payload
                      })
                      .addCase(AssignToEngineer.rejected, (state, action) =>{
                        state.isLoading = false
                        state.isSuccess = false
                        console.log("Assign To Engineer is Rejected With :---", action.payload)
                      })

                      // Order Action
                         .addCase(OrderActionClick.pending, (state, action) =>{
                        state.isLoading = true
                        state.isSuccess = false
                        console.log("Order Completed is Pending :-----", action.payload)
                      })
                      .addCase(OrderActionClick.fulfilled, (state ,action) =>{
                        state.isLoading = false
                        state.isSuccess = true
                        console.log("Order Completed Successfully!!", action.payload)
                      })
                      .addCase(OrderActionClick.rejected, (state, action) =>{
                        state.isLoading = false
                        state.isSuccess = false
                        console.log("Order Completed Click is Rejected With :---", action.payload)
                      })
    }
})


export default OrderSlice.reducer;
export const {update} = OrderSlice.actions;

//  Download Thunk
export const DownloadOrders = createAsyncThunk(
  "DOWNLOAD/REPAIR/UNIT/ORDER/BY/USER/ID", 
  async (requestData, thunkAPI) => {
    try {

      const response = await putRequestMethodForDownload(requestData, UrlConstants.DOWNLOAD_REPAIR_UNIT_ORDER, true) 

      console.log(`Response from Download Repair Unit Order API: `, response );

      if (response) {
        await handleFileDownload(response, 'repair_unit_orders.pdf');
      }

      return response ? { success: true } : response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const handleFileDownload = (response: any, filename: string) => {
  return new Promise((resolve, reject) => {
    try {
      // Create blob from response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let downloadFilename = filename;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          downloadFilename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', downloadFilename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
      
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

// Filter Order Thunk
export const GetAllRepairUnitOrderByUserId = createAsyncThunk("FETCH/ALL/REPAIR/UNIT/ORDER/BY/USER/ID", async (requestData, thunkAPI) =>{
  try {
    const response = await postRequestMethod(requestData, UrlConstants.GET_ALL_REPAIR_UNIT_ORDER_BY_USER_ID);
    console.log("Response Data :---", response);
    return response
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
  }
})

// Update Order Thunk
export const UpdateOrder = createAsyncThunk("UPDATE/ORDER", async (orderId: string, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as any;
    const updateData = state.OrderSlice.Edit.order;

    if (!updateData || !updateData.orderId) {
      return thunkAPI.rejectWithValue("No Data To Update!");
    }

    const requestBody: any = {
      orderId: updateData.orderId,
      unitRepairStatus: updateData.unitRepairStatus,
      price: updateData.price.toString(),
      engDefectDescription: updateData.engDefectDescription,
    };

    // Add orderExpectedCompletedOn if present
    if (updateData.orderExpectedCompletedOn) {
      requestBody.orderExpectedCompletedOn = updateData.orderExpectedCompletedOn;
    }

       // Add delayReason only if present and not empty
    if (updateData.delayReason && updateData.delayReason.trim() !== "") {
      requestBody.delayReason = updateData.delayReason;
    } else {
      // If delayReason is empty, don't send it or send null
      requestBody.delayReason = null;
    }

    console.log("🛠️ Update payload being sent:", requestBody);

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

// Filter User By Email Thunk
export const FindUserByEmail = createAsyncThunk("FIND/BY/EMAIL", async (requestData, thunkAPI) =>{
  try {
    const response = await postRequestMethod(requestData, UrlConstants.GET_ALL_USER);
     console.log("Response Data :---", response);
        return response;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Assign Engineer Thunk
export const AssignToEngineer = createAsyncThunk("ASSIGN/TO/ENGINEER", async (requestData, thunkAPI) =>{
  try {
    const response = await putRequestMethodWithParam(requestData, UrlConstants.ASSIGN_TO_ENGINEER);
     console.log("Response Data :---", response);
        return response;
  } catch (error: any) {
            const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

//  Common Order Action Thunk
export const OrderActionClick = createAsyncThunk(
  "ORDER/ACTION",
  async ({ type, requestData }: { type: string; requestData: any }, thunkAPI) => {
    try {
      let url;
      switch (type) {
        case "COMPLETE":
          url = UrlConstants.ORDER_COMPLETED;
          break;
        case "DELIVER":
          url = UrlConstants.ORDER_DELIVERED;
          break;
        case "CANCEL":
          url = UrlConstants.ORDER_CANCELLED;
          break;
        default:
          throw new Error("Invalid order action type");
      }

      const response = await putRequestMethodWithParam(requestData, url);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
