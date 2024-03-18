import { createSlice } from "@reduxjs/toolkit"
import { fetchAuthenticationStatus } from "../../apis/client"

const initialState = {
    isAuthenticated: false,
    status: 'idle',
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (buider) => {
        buider
            .addCase(fetchAuthenticationStatus.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(fetchAuthenticationStatus.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.isAuthenticated = action.payload;
            })
            .addCase(fetchAuthenticationStatus.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message;
            })
    }
})

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated; 
export const getIsAuthenticatedStatus = (state) => state.auth.status; 
export const getIsAuthenticatedError = (state) => state.auth.error; 

export default authSlice.reducer;