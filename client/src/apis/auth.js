import API from './client'
import { createAsyncThunk } from '@reduxjs/toolkit';

export const register = async (data) => {
    try {
        const response = await API.post('auth/register', data);

        return response.data;

    } catch (err) {
        throw err.response;
    }
}

export const login = async (creds) => {
    try {
        const response = await API.post('auth/login', creds, {
            withCredentials: true
        });
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
            console.log(response.data);
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


// export const isAuthenticated = async () => {
//     try {
//         console.log('check4');
//         const response = await API.get('auth/google/login/success');
//         return response.data.success;
//     } catch (err) {
//         throw err.response;
//     }
// }

export const logout = async () => {
    try {
        const response = await API.get('auth/google/logout', {
            withCredentials: true
        });
        console.log("check 2", response.data);
        return response.data;
    } catch (err) {
        throw err.response;
    }
}