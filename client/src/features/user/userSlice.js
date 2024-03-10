import { createSlice } from "@reduxjs/toolkit"
import { fetchUserData } from "../../apis/user"


const initialState = {
    user: [],
    status: 'idle',
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.user = action.payload;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message;
            })
    }
})

export const selectUser = (state) => state.user.user;
export const getUserStatus = (state) => state.user.status;
export const getUserError = (state) => state.user.error;

export default userSlice.reducer;