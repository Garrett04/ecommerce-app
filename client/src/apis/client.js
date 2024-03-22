import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_ENVIRONMENT === 'production' ? `${process.env.REACT_APP_API_URL}/api/` : 'http://localhost:3000/api/',
    withCredentials: true
})

export const fetchAuthenticationStatus = createAsyncThunk(
    'auth/fetchAuthenticationStatus',
    async () => {
        try {
            const response = await API.get('auth/check-authentication');
            // console.log(response.data);
            
            return response.data.authenticated;
        } catch (err) {
            console.error(err);
        }
    }
)

export default API;