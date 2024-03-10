import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import productDetailsReducer from "../features/products/productDetailsSlice";
import cartsReducer from "../features/carts/cartsSlice";
import cartReducer from "../features/carts/cartSlice";

export const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
        carts: cartsReducer,
        cart: cartReducer
    },
})