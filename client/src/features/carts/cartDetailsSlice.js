import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    cart: [],
    status: 'idle',
    error: null
}

const cartDetailsSlice = createSlice({
    name: 'cart',
    initialState,
    extraReducers: (builder) => {
        
    }
})