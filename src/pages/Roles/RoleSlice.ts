import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequestMethod, getRequestMethodWithParam, postRequestMethod } from "../../util/CommonService";
import { UrlConstants } from "../../util/practice/UrlConstants";

const storeData = localStorage.getItem("role")

interface User {
    id: string;
    name: string;
}

interface Role {
    isLoading: boolean;
    isSuccess: boolean;
    roleData: User[];
    Edit: {role: User | {name: string}, isEdit: boolean}
}

const initialState: Role = {
    isLoading: false,
    isSuccess: false,
    roleData : storeData ? JSON.parse(storeData) : [],
    Edit: {role: { name: "" }, isEdit: false}
}

const RoleSlice = createSlice({
    name: 'RoleSlice',
initialState,
reducers: {
         Update : (state , action) =>{
            return {
                ...state,
                Edit : {role : action.payload , isEdit : true}
            }
        },
        restore: () => {
                            return {
                                isLoading: false,
                                isSuccess: false,
                                roleData: storeData ? JSON.parse(storeData) : [],
                                Edit: { role: {}, isEdit: false }
                            }
                        }
},
extraReducers: (builder) => {
      builder 
.addCase(GetAllRoles.pending  , (state ) =>{
state.isLoading = true
state.isSuccess = false
})
.addCase(GetAllRoles.fulfilled , (state , action) =>{
state.isLoading = false;
state.isSuccess = true;
state.roleData = action.payload
})
.addCase(GetAllRoles.rejected , (state , action) =>{
state.isLoading = false;
state.isSuccess = false;
console.log("Roles Data Fetch Faield ----------", action.payload)
                    })

.addCase(GetRoleById.pending  , (state ) =>{
state.isLoading = true
state.isSuccess = false
})
.addCase(GetRoleById.fulfilled , (state , action) =>{
state.isLoading = false;
state.isSuccess = true;
state.roleData = action.payload
})
.addCase(GetRoleById.rejected , (state , action) =>{
state.isLoading = false;
state.isSuccess = false;
console.log("Add Category fetch Faield ----------", action.payload)
})
    
.addCase(CreateRole.pending , (state) =>{
state.isLoading = true
state.isSuccess = false
})
.addCase(CreateRole.fulfilled , (state , action) =>{
state.isLoading = false;
state.isSuccess = true;
state.roleData = [...state.roleData , action.payload]
})
.addCase(CreateRole.rejected , (state , action) =>{
state.isLoading = false
state.isSuccess = false
console.log("Category Not Created..." , action.payload)
})

                      .addCase(UpdtaeRole.pending, (state) =>{
                            state.isLoading = true
                            state.isSuccess = false
                        })
                        .addCase(UpdtaeRole.fulfilled , (state , action) =>{
                            state.isLoading = false
                            state.isSuccess = true
                            state.roleData = state.roleData.map((brand) => brand.id === action.payload?.id ? action.payload : brand)
                            state.Edit = {isEdit : false, role : {name : ""}}
                        })
                        .addCase(UpdtaeRole.rejected , (state , action) =>{
                             state.isLoading = false
                state.isSuccess = false
                console.log(action.payload || "Failed to update Brand")
                        })

}
})


export default RoleSlice.reducer
export const {Update, restore} = RoleSlice.actions

// Fetch All Roles
export const GetAllRoles = createAsyncThunk("FETCH/ALL/ROLES", async (_, thunkAPI) =>{
     try {
        const response = await getRequestMethod(UrlConstants.GET_ALL_ROLES)
        console.log(response)
        return response
    } catch (error : any ) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})


// Fetch By Id
export const GetRoleById = createAsyncThunk("FETCH/ROLE/BY/ID", async (id: string, thunkAPI) =>{
    try {
        const response = await getRequestMethodWithParam({entityPK: id}, UrlConstants.GET_ROLE_BY_ID);
        console.log("Rresponse data :---", response);
        return response
    } catch (error: any) {
          const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})


// Create Role
export const CreateRole = createAsyncThunk("CREATE/ROLE", async (requestData, thunkAPI) =>{
    try {
        const response = await postRequestMethod(requestData, UrlConstants.ADD_ROLE);
        console.log("Response Data :--", response);
        return response
    } catch (error: any) {
               const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Update Role
export const UpdtaeRole = createAsyncThunk("UPDATE/ROLE", async (id:string, thunkAPI) =>{
    try {
        const updateData = thunkAPI.getState().RoleSlice?.Edit?.role;
        if(!updateData) return thunkAPI.rejectWithValue("No Data to update!!")

            const payload = {
                id: id,
                name: updateData.name
            }

                const response = await postRequestMethod(
payload,
                    UrlConstants.ADD_ROLE
                        );
                        console.log("Update response:" , response)
                        return response;
    } catch (error: any) {
                const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})