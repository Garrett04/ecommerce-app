import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "./client";

export const fetchAddressesByUserId = createAsyncThunk(
    'addresses/fetchAddressesByUserId',
    async () => {
        try {
            const response = await API.get('users/addresses', {
                withCredentials: true
            });
            
            return response.data.addresses;

        } catch (err) {
            if (err.response && err.response.status === 404) {
                // console.log(err);
                throw err.response.data.msg;
            }
        }
    }
)