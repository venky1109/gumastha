import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import customerReducer from '../features/customers/customerSlice';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    customers: customerReducer,
    cart: cartReducer
  }
});
