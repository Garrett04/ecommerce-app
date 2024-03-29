import API from './client'
import { createAsyncThunk } from '@reduxjs/toolkit';

export const register = async (data) => {
    try {
        const response = await API.post('auth/register', data);
        // console.log(response.data);
        return response.data;

    } catch (err) {
        throw err.response;
    }
}

export const login = async (creds) => {
    try {
        const response = await API.post('auth/login', creds);
        return response.data;
    } catch (err) {
        // console.log(err);
        throw err.response;
    }
}

export const fetchGoogleUser = createAsyncThunk(
    'user/fetchGoogleUser',
    async () => {
        try { 
            // console.log('check1')
            const response = await API.get('auth/login/success', {
                withCredentials: true,
            });
            // console.log(response.data);
            return { 
                data: response.data.user, 
                token: response.data.token, 
            };
        } catch (err) {
            // console.log(err);
            throw err.message;
        }
    }
) 

export const logout = async () => {
    try {
        const response = await API.post('auth/logout');
        // console.log("check 2", response.data);
        return response.data;
    } catch (err) {
        throw err.response;
    }
}