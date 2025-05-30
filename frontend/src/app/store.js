import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import customerReducer from '../features/customers/customerSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/orders/orderSlice';
import catalogReducer from '../features/catalogs/catalogSlice';

export const store = configureStore({
  reducer: {
    catalogs: catalogReducer, 
    products: productReducer,
    customers: customerReducer,
    cart: cartReducer,
    orders: orderReducer
  }
});
