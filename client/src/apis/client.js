import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({
    baseURL: 'http://localhost:3000/api/',
})

// Checks if token is there in local storage and adds it to axios header
export const setAuthToken = () => {
    const token = localStorage.getItem('token');

    if (token) {
        API.defaults.headers.common['Authorization'] = token;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
}

// Checks if user is authenticated
export const isAuthenticated = () => {
    if (localStorage.getItem('token')) {
      return true;
    }
}

export default API;