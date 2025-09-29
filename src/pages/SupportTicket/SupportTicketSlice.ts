import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pageSize } from "../../helper/ApplicationConstants";
import { getRequestMethodWithParam, postRequestMethod, putRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager";

const storeData = LocalStorageManager.getData(STORAGE_KEYS.SUPPORT_TICKET);

// Role interface
interface Role {
  id: number;
  name: string;
}

// User/CreatedBy interface
interface User {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  personalEmail: string | null;
  password: string;
  createdAt: string | null;
  deviceToken: string;
  role: Role;
  createdBy: User | null;
}

// Complete Support Ticket interface (response data)
interface SupportTicket {
  id: number;
  userIssue: string;
  ticketNumber: string;
  supportTicketStatus: "PENDING" | "REOPEN" | "INREVIEW" | "CLOSED";
  seniorCSDescription: string;
  customer_support: any | null;
  seniorCustomerSupport: any | null;
  createdBy: User;
  unitRepairOrder: any | null;
  createdOn: string;
  closed: boolean;
  cssescription: string;
}

// Redux state interface
interface SupportTicketState {
  isLoading: boolean;
  isSuccess: boolean;
  SupportTicketData: SupportTicket[];
  Edit: {supportTicket: SupportTicket, isEdit: boolean};
}


const initialState: SupportTicketState = {
    isLoading: false,
    isSuccess: false,
    SupportTicketData: storeData || [],
    Edit: {
        isEdit: false,
        supportTicket: {
            id: 0,
            userIssue: "",
            ticketNumber: "",
            supportTicketStatus: "PENDING",
            seniorCSDescription: "",
            customer_support: null,
            seniorCustomerSupport: null,
            createdBy: {
                id: 0,
                firstName: "",
                lastName: "",
                mobile: "",
                email: "",
                personalEmail: null,
                password: "",
                createdAt: null,
                deviceToken: "",
                role: {
                    id: 0,
                    name: ""
                },
                createdBy: null
            },
            unitRepairOrder: null,
            createdOn: "",
            closed: false,
            cssescription: ""
        }
    }
}

const SupportTicketSlice = createSlice({
    name: 'SupportTicketSlice',
    initialState,
    reducers: {
        Update: (state, action) => {
            state.Edit = { supportTicket: action.payload, isEdit: true }
        },
    },
    extraReducers: (builder) =>{
        builder
        .addCase(GetAllSupportTicket.pending, (state, action) =>{
            state.isLoading = true
            state.isSuccess = false
            console.log("All Support Ticet Data is Pending :--", action.payload)
        })
        .addCase(GetAllSupportTicket.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.SupportTicketData = action.payload.content;
            LocalStorageManager.saveData(STORAGE_KEYS.SUPPORT_TICKET, action.payload);
        })
        .addCase(GetAllSupportTicket.rejected, (state, action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("All Support Ticket Data is Reject With Error :--", action.payload)
        })

// Fetch By Ticket Number
 .addCase(GetAllSupportTicketByTicketNumber.pending, (state, action) =>{
            state.isLoading = true
            state.isSuccess = false
            console.log("All Support Ticet By Ticket Number Data is Pending :--", action.payload)
        })
        .addCase(GetAllSupportTicketByTicketNumber.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.SupportTicketData = action.payload.content;
            LocalStorageManager.saveData(STORAGE_KEYS.SUPPORT_TICKET, action.payload);
        })
        .addCase(GetAllSupportTicketByTicketNumber.rejected, (state, action) =>{
            state.isLoading = false
            state.isSuccess = false
            console.log("All Support Ticket By Ticket Number Data is Reject With Error :--", action.payload)
        })

        // Create Support Ticket
        .addCase(AddsupportTicket.pending, (state, action) =>{
            state.isLoading = true
            state.isSuccess = false
            console.log("Support Ticket Data Creating is Pending ....", action.payload)
        })
        .addCase(AddsupportTicket.fulfilled, (state, action) =>{
            state.isLoading = false
            state.isSuccess = true
            state.SupportTicketData = [...state.SupportTicketData, action.payload];
            LocalStorageManager.saveData(STORAGE_KEYS.SUPPORT_TICKET, [...state.SupportTicketData]);
        })
        .addCase(AddsupportTicket.rejected, (state, action) =>{
            state.isLoading = false
            state.isSuccess = false 
            console.log("Support Ticket Data Creating is Failed With :----", action.payload)
        })

         // Update Support Ticket
        .addCase(UpdateSupportTicket.pending, (state, action) => {
            state.isLoading = true
            state.isSuccess = false
            console.log("Support Ticket Updating is Pending :---", action.payload)
        })
     .addCase(UpdateSupportTicket.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;

            const updatedItem = action.payload;
            const itemIndex = state.SupportTicketData.findIndex((item) => item.id === updatedItem.id);
            if(itemIndex !== -1) {
                state.SupportTicketData[itemIndex] = updatedItem;
            }

            // Sync to localStorage
            LocalStorageManager.saveData(STORAGE_KEYS.SUPPORT_TICKET, [...state.SupportTicketData]);

            // Reset Edit State
            state.Edit = initialState.Edit
        })   
             .addCase(UpdateSupportTicket.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = false
            console.log("Support Ticket Data Updation Failed :--", action.payload)
        })
    }
})


export default SupportTicketSlice.reducer
export const {Update} = SupportTicketSlice.actions

// Fetch All Support Ticket
export const GetAllSupportTicket = createAsyncThunk("FETCH/ALL/SUPPORT-TICKET", async (_, thunkAPI) =>{
    try {
        const param = {
            pageSize,
            pageNumber: 0
        }
        const response = await getRequestMethodWithParam(param, UrlConstants.GET_ALL_SUPPORT_TICKET);
        console.log("Response Data :--", response);
        return response;
    } catch (error: any) {
            const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})

// Fetch All Support Ticket By Ticket-Number
export const GetAllSupportTicketByTicketNumber = createAsyncThunk("FETCH/ALL/SUPPORT-TICKET/BY/TICKET-NUMBER", async (ticketNumber, thunkAPI) =>{
    try {
        const param = {
            pageSize,
            pageNumber: 0,
            ticketNumber,
        }
        const response = await getRequestMethodWithParam(param, UrlConstants.GET_ALL_SUPPORT_TICKET);
        console.log("Response Data :--", response);
        return response;
    } catch (error: any) {
            const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})

// Create Support Ticket
export const AddsupportTicket = createAsyncThunk("ADD/SUPPORT-TICKET", async (requestData: any, thunkAPI) =>{
    try {
        const response = await postRequestMethod(requestData, UrlConstants.ADD_SUPPORT_TICKET);
        console.log("Response Data :--", response);
        return response;
    } catch (error: any) {
             const message = error?.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
    }
})

// Update Support Ticket
export const UpdateSupportTicket = createAsyncThunk(
  "UPDATE/SUPPORT-TICKET",
  async (updatePayload: { id: number; updateData: any }, thunkAPI) => {
    try {
      const { id, updateData } = updatePayload;

      const requestBody = {
        id: id,
        userIssue: updateData.userIssue,
        ticketNumber: updateData.ticketNumber,
        supportTicketStatus: updateData.supportTicketStatus,
        seniorCSDescription: updateData.seniorCSDescription,
        createdOn: updateData.createdOn,
        cssescription: updateData.cssescription,
      };

      console.log("RequestBody Response Data :--", requestBody);

      const response = await putRequestMethod(
        requestBody,
        `${UrlConstants.UPDATE_SUPPORT_TICKET}`
      );

      console.log("Response To Update Support Ticket :--", response);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);