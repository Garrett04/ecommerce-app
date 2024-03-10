import { createSlice } from "@reduxjs/toolkit"
import { fetchCategories } from "../../apis/categories"


const initialState = {
    categories: [],
    status: 'idle',
    error: null
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message;
            })
    }
})

export const selectCategories = (state) => state.categories.categories;
export const getCategoriesStatus = (state) => state.categories.status;
export const getCategoriesError = (state) => state.categories.error;

export default categoriesSlice.reducer;