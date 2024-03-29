import API from './client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        try {
            const response = await API.get('products');

            return response.data.products;
            
        } catch (err) {
            throw err.response.data.msg;
        }
    }
)

export const fetchProductById = createAsyncThunk(
    'productDetails/fetchProductById',
    async (productId) => {
        try {
            const response = await API.get(`products/${productId}`)
            // console.log(response.data);
            return response.data.product;
        } catch (err) {
            throw err.response.data.msg;
        }
    }
)

export const fetchProductsByCategory = createAsyncThunk(
    'products/fetchProductsByCategory',
    async (id) => {
        try {
            const response = await API.get(`products/category/${id}`);
            // console.log(response.data);
            return response.data.products;
        } catch (err) {
            throw err.response.data.msg;
        }
    }
)