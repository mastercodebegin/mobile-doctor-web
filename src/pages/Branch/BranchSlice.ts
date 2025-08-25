import { createSlice } from "@reduxjs/toolkit";

interface Branch {
    isLoading: boolean;
    isSuccess: boolean;
}

const initialState: Branch = {
    isLoading: false,
    isSuccess: false,
}

const BranchSlice = createSlice({
    name: "BranchSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) =>{}
})


export default BranchSlice.reducer