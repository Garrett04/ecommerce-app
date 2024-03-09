import { createAsyncThunk } from '@reduxjs/toolkit';
import API from './client';

// Fetch cart by cart Id
export const fetchCartById = createAsyncThunk(
    'carts/fetchCartById',
    async (id) => {
        try {
            const response = await API.get(`cart/${id}`);
            console.log(response.data);
            return response.data;
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
            if (err.response.status === 401) {
                // console.log(err.response);
                throw new Error('Unauthorized');
            } else {
                throw err;
            }
        }
    }
)