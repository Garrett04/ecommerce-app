import { createSlice } from "@reduxjs/toolkit"
import { fetchCartById } from "../../apis/cart"


const initialState = {
    cart: [],
    status: 'idle',
    error: null
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartById.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchCartById.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                console.log(action.payload);
                state.cart = action.payload;
            })
            .addCase(fetchCartById.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message;
            })
    }
})

export const selectCart = (state) => state.cart.cart;
export const getCartStatus = (state) => state.cart.status;
export const getCartError = (state) => state.cart.error;

export default cartSlice.reducer;