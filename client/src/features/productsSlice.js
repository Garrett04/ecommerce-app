import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "../apis/products";

const initialState = {
    products: [],
    status: 'idle', // idle | pending | fulfilled | rejected
    error: null
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message;
            })
    }
})

export const selectAllProducts = (state) => state.products.products;
export const getProductsStatus = (state) => state.products.status;
export const getProductsError = (state) => state.products.error;

export default productsSlice.reducer;