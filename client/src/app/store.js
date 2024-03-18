import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import productDetailsReducer from "../features/products/productDetailsSlice";
import cartsReducer from "../features/carts/cartsSlice";
import cartReducer from "../features/carts/cartSlice";
import userReducer from "../features/user/userSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
import addressesReducer from "../features/user/addressesSlice";
import ordersReducer from "../features/orders/ordersSlice";
import orderReducer from "../features/orders/orderSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
        carts: cartsReducer,
        cart: cartReducer,
        auth: authReducer,
        user: userReducer,
        orders: ordersReducer,
        order: orderReducer,
        addresses: addressesReducer,
        categories: categoriesReducer,
    },
})