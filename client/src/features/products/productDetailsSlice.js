import { createSlice } from "@reduxjs/toolkit"
import { fetchProductById } from "../../apis/products"

const initialState = {
    product: [],
    status: 'idle',
    error: null
}

const productDetailsSlice = createSlice({
    name: 'productDetail',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.product = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message;
            })
    }
})

export const selectProductDetails = (state) => state.productDetails.product;
export const getProductDetailsStatus = (state) => state.productDetails.status;
export const getProductDetailsError = (state) => state.productDetails.error;

export default productDetailsSlice.reducer;