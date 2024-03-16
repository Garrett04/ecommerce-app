import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "./client";

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async () => {
        try {
            const response = await API.get('orders', {
                withCredentials: true
            });
            console.log(response.data);
            return response.data.orders;
        } catch (err) {
            throw err.response.data.msg;
        }
    }
)

export const fetchOrderById = createAsyncThunk(
    'order/fetchOrderById',
    async (id) => {
        try {
            const response = await API.get(`orders/${id}`, {
                withCredentials: true
            });
            console.log(response.data);
            return { 
                data: response.data.order, 
                total_amount: response.data.total_amount,
                order_status: response.data.order_status 
            };
        } catch (err) {
            throw err.response.data.msg;
        }
    }
)