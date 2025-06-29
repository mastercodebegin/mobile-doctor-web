import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/User";


interface VendorState {
  isLoading: boolean;
  isSuccess: boolean;
  data: User[];
}

const initialState : VendorState = {
  isLoading : false,
        isSuccess : false,
        data :   [
    {
      id: 1,
      name: 'Andrew Mike',
      avatar: '/api/placeholder/40/40',
      dateCreated: '04/10/2014',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: 2,
      name: 'John Doe',
      avatar: '/api/placeholder/40/40',
      dateCreated: '06/09/2015',
      role: 'Publisher',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Micheal Holz',
      avatar: '/api/placeholder/40/40',
      dateCreated: '09/05/2016',
      role: 'Publisher',
      status: 'Inactive',
    },
    {
      id: 4,
      name: 'Alex Mike',
      avatar: '/api/placeholder/40/40',
      dateCreated: '11/09/2018',
      role: 'Reviewer',
      status: 'Suspended',
    },
    {
      id: 5,
      name: 'Paula Wilson',
      avatar: '/api/placeholder/40/40',
      dateCreated: '09/09/2019',
      role: 'Reviewer',
      status: 'Active',
    },
    {
      id: 6,
      name: 'Martin Sommer',
      avatar: '/api/placeholder/40/40',
      dateCreated: '04/10/2020',
      role: 'Moderator',
      status: 'Inactive',
    },
    {
      id: 7,
      name: 'Andrew Mike',
      avatar: '/api/placeholder/40/40',
      dateCreated: '04/10/2014',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: 8,
      name: 'John Doe',
      avatar: '/api/placeholder/40/40',
      dateCreated: '06/09/2015',
      role: 'Publisher',
      status: 'Active',
    },
    {
      id: 9,
      name: 'Micheal Holz',
      avatar: '/api/placeholder/40/40',
      dateCreated: '09/05/2016',
      role: 'Publisher',
      status: 'Inactive',
    },
    {
      id: 10,
      name: 'Alex Mike',
      avatar: '/api/placeholder/40/40',
      dateCreated: '11/09/2018',
      role: 'Reviewer',
      status: 'Suspended',
    },
    {
      id: 11,
      name: 'Paula Wilson',
      avatar: '/api/placeholder/40/40',
      dateCreated: '09/09/2019',
      role: 'Reviewer',
      status: 'Active',
    },
    {
      id: 12,
      name: 'Martin Sommer',
      avatar: '/api/placeholder/40/40',
      dateCreated: '04/10/2020',
      role: 'Moderator',
      status: 'Inactive',
    },
  ]
}

const VendorSlice = createSlice({
    name : 'VendorSlice',
    initialState,
    reducers : {
      Remove : (state , action) =>{
state.data = state.data.filter(item => item.id !== action.payload)
localStorage.setItem("card", JSON.stringify(state.data))
      },
      Add : (state , action) =>{
        return{
            ...state,
            data : [...state.data, action.payload]
        }
      }
        },
    extraReducers : (builder) =>{}
})

export default VendorSlice.reducer
export const {Remove , Add} = VendorSlice.actions