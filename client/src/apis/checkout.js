import API from "./client";


export const createCheckoutSession = async (id) => {
    try {
        const response = await API.post(`cart/${id}/checkout/create-checkout-session`, null, {
            withCredentials: true
        });
        console.log('check1', response.data);
        return response.data;

    } catch (err) {
        throw err.response;
    }
}
