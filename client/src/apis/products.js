import API from './client';

export const getProducts = async () => {
    try {
        const response = await API.get('products');

        // console.log(response.data);

        return response.data.products;

    } catch (err) {
        throw err.response;
    }
}