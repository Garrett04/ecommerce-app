import { createSlice } from "@reduxjs/toolkit"
import { createCart, fetchCarts } from "../../apis/cart"


const initialState = {
    carts: [],
    status: 'idle',
    error: null
}

const cartsSlice = createSlice({
    name: 'carts',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchCarts.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchCarts.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                console.log(action.payload);
                state.carts = action.payload;
            })
            .addCase(fetchCarts.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message;
            })
    }
})

export const selectCarts = (state) => state.carts.carts;
export const getCartsStatus = (state) => state.carts.status;
export const getCartsError = (state) => state.carts.error;

export default cartsSlice.reducer;