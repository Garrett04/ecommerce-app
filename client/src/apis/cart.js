import { createAsyncThunk } from '@reduxjs/toolkit';
import API from './client';

// Fetch cart by cart Id
export const fetchCartById = createAsyncThunk(
    'cart/fetchCartById',
    async (id) => {
        try {
            const response = await API.get(`cart/${id}`);
            console.log(response.data);
            return {data: response.data.data, subtotal: response.data.subtotal};
        } catch (err) {
            throw err.response;
        }
    }
)

export const createCart = async (data) => {
    try {
        console.log(data);
        const response = await API.post('cart', data)
        console.log(response.data);
        return response.data;
    } catch (err) {
        throw err.response;
    }
}

export const fetchCarts = createAsyncThunk(
    'carts/fetchCarts',
    async () => {
        try {
            const response = await API.get('cart');
            // console.log(response);
            return response.data.carts;
            
        } catch (err) {
            // console.log(err);
            console.error(err);
            throw err.response.data.msg;
        }
    }
)

export const addProduct = async (id, data) => {
    try {
        const response = await API.post(`cart/${id}`, data);
        return response.data.cart;
    } catch (err) {
        throw err.response;
    }
}

export const removeProduct = async (id, product_id) => {
    try {
        const response = await API.delete(`cart/${id}?product_id=${product_id}`)

        console.log(response.data);

        return response.data.deletedCart;
    } catch (err) {
        throw err.response.data.msg;
    }
}