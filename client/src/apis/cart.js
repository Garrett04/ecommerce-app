import { createAsyncThunk } from '@reduxjs/toolkit';
import API from './client';

// Fetch cart by cart Id
export const fetchCartById = createAsyncThunk(
    'cart/fetchCartById',
    async (id) => {
        try {
            const response = await API.get(`cart/${id}`, {
                withCredentials: true
            });
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
            const response = await API.get('cart', {
                withCredentials: true
            });
            // console.log(response);
            return response.data.carts;
            
        } catch (err) {
            // console.log(err);
            if (err.response.status === 401) {
                // console.log(err.response);
                throw new Error('Unauthorized');
            } else {
                throw err;
            }
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
        const response = await API.delete(`cart/${id}?product_id=${product_id}`, {
            withCredentials: true
        })

        console.log(response.data);

        return response.data.deletedCart;
    } catch (err) {
        throw err.response.data.msg;
    }
}