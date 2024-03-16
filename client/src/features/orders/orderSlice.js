import { createSlice } from "@reduxjs/toolkit"
import { fetchOrderById } from "../../apis/orders"


const initialState = {
    order: {},
    status: 'idle',
    error: null
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderById.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.order = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message;
            })
    }
})


export const selectOrder = (state) => state.order.order;
export const getOrderStatus = (state) => state.order.status;
export const getOrderError = (state) => state.order.error;

export default orderSlice.reducer;