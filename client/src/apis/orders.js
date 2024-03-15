import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "./client";

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrder',
    async () => {
        try {
            const response = await API.get('orders', {
                withCredentials: true
            });
            console.log(response.data);
            return response.data;
        } catch (err) {
            throw err.response.data.msg;
        }
    }
)

export const fetchOrdersById = createAsyncThunk(
    'orders/fetchOrdersById',
    async (id) => {
        try {
            const response = await API.get(`orders/${id}`, {
                withCredentials: true
            });
            console.log(response.data);
            return response.data;
        } catch (err) {
            throw err.response.data.msg;
        }
    }
)