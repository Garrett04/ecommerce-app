import { createSlice } from "@reduxjs/toolkit"
import { fetchOrders, fetchOrdersById } from "../../apis/orders"


const initialState = {
    orders: [],
    status: 'idle',
    error: null
}

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'rejected';
                state.orders = action.payload;
            })
            .addCase(fetchOrdersById.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchOrdersById.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.orders = action.payload;
            })
            .addCase(fetchOrdersById.rejected, (state, action) => {
                state.status = 'rejected';
                state.orders = action.payload;
            })
    }
})

export const selectOrders = (state) => state.orders.orders;
export const getOrdersStatus = (state) => state.orders.status;
export const getOrdersError = (state) => state.orders.error;

export default ordersSlice.reducer;