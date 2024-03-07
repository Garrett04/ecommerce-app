import API from './client'

export const register = async (data) => {
    try {
        const response = await API.post('users/register', data);

        return response.data;

    } catch (err) {
        throw err.response;
    }
}