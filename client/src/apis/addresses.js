import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "./client";

export const fetchAddressesByUserId = createAsyncThunk(
    'addresses/fetchAddressesByUserId',
    async () => {
        try {
            const response = await API.get('users/addresses');
            
            return response.data.addresses;

        } catch (err) {
            if (err.response && err.response.status === 404) {
                // console.log(err);
                throw err.response.data.msg;
            }
        }
    }
)

// export const fetchAddress

export const createAddress = async (data) => {
    try {
        const response = await API.post('users/addresses/add-address', (data));

        return response.data.address;
    } catch (err) {
        throw err.response;
    }
}

export const updateAddress = async (id, data) => {
    try {
        const response = await API.put(`users/addresses/${id}`, (data))

        return response.data.address;
    } catch (err) {
        throw err.response.data.msg;
    }
}

export const deleteAddress = async (id) => {
    try {
        const response = await API.delete(`users/addresses/${id}`)
        
        return response.data.msg;

    } catch (err) {
        throw err.response.data.msg;
    }
}

// To update the default_shipping_address_id or default_billing_address_id in the addresses table
export const updateDefaultAddress = async (id, option) => {
    try {
        const response = await API.put(`users/addresses/update-default-address/${id}`, (option))

        console.log(response.data);

        return response.data.address;

    } catch (err) {
        throw err.response.data.msg;
    }
}