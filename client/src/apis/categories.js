import API from "./client";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async () => {
        try {
            const response = await API.get('categories');

            console.log(response.data);
            return response.data.categories;

        } catch (err) {
            throw err.response;
        }
    }
)