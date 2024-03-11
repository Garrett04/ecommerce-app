import API from "./client";


export const createCheckoutSession = async (id) => {
    try {
        const response = await API.post(`cart/${id}/checkout/create-checkout-session`);
        // console.log('hello', response);
        return response.data.url;

    } catch (err) {
        throw err.response;
    }
}