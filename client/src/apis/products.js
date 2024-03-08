import API from './client';
import { createAsyncThunk } from '@reduxjs/toolkit';

// export const getProducts = async () => {
//     try {
//         const response = await API.get('products');

//         // console.log(response.data);

//         return response.data.products;

//     } catch (err) {
//         throw err.response;
//     }
// }

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        try {
            const response = await API.get('products');

            return response.data.products;
            
        } catch (err) {
            throw err.response;
        }
    }
)