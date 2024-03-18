import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:3000/api/',
    withCredentials: true
})

// Checks if token is there in local storage and adds it to axios header
export const setAuthToken = () => {
    const token = localStorage.getItem('token');

    if (token) {
        API.defaults.headers.common['Authorization'] = token;
    }
}

export const removeAuthToken = () => {
    delete API.defaults.headers.common['Authorization'];
}

// Checks if user is authenticated
// export const isAuthenticated = (userStatus) => {
//     // console.log('hello from isAuthenticated');
//     // console.log(localStorage.getItem('token'))
//     // console.log(userStatus);

//     // Checks if userStatus from redux store is fulfilled or a token is present in the localStorage
//     // userStatus indicating the dispatch of fetchGoogleUser which when the user is logged in will be fulfilled
//     if (userStatus === 'fulfilled') {
//         return 'google';
//     } else if (localStorage.getItem('token')) {
//       return 'custom';
//     }
// }

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