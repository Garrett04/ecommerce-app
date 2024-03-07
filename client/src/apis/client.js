import axios from "axios";

const token = localStorage.getItem('token');

export default axios.create({
    baseURL: 'http://localhost:3000/api/',
    headers: {
        'Authorization': token 
    }
});