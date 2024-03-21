import { createSlice } from "@reduxjs/toolkit"
import { fetchAddressesByUserId } from "../../apis/addresses"

const initialState = {
    addresses: [],
    status: 'idle',
    error: null
}

const addressesSlice = createSlice({
    name: 'addresses',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddressesByUserId.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchAddressesByUserId.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                // console.log("check3", action.payload)
                state.addresses = action.payload;
            })
            .addCase(fetchAddressesByUserId.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message;
            })
    }
})

export const selectAddresses = (state) => state.addresses.addresses;
export const getAddressesStatus = (state) => state.addresses.status;
export const getAddressesError = (state) => state.addresses.error;

export default addressesSlice.reducer;