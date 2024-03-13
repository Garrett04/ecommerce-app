import axios from 'axios';
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
            const response = await axios.get('http://localhost:3000/api/auth/login/success', {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });
            console.log(response.data);
            return { 
                data: response.data.user, 
                token: response.data.token, 
            };
        } catch (err) {
            throw err.response;
        }
    }
) 


// export const isLoggedIn = async () => {
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
        const response = await axios.get('http://localhost:3000/api/auth/google/logout', {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });
        console.log("check 2", response.data);
        return response.data;
    } catch (err) {
        throw err.response;
    }
}