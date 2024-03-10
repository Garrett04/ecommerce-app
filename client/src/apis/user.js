import { createAsyncThunk } from '@reduxjs/toolkit';
import API from './client';

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async () => {
        try {
            const response = await API.get('users');
    
            console.log(response.data);
    
            return response.data.user;
    
        } catch (err) {
            throw err.response;
        }
    }
)

export const updateUser = async (data) => {
    try {
        const response = await API.put('users', data);

        console.log(response.data);

        return response.data.user;
    } catch (err) {
        throw err.response;
    }
}