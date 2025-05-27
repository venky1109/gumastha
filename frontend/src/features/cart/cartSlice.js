// 📁 features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
       const discountAmount = existing.price * (existing.discount / 100);
        existing.subtotal = (existing.price - discountAmount) * existing.quantity;

      } else {
        const newItem = {
          id: product.id,
          item: product.productName,
          stock: parseInt(product.quantity),
          quantity: 1,
          price: product.MRP,
          discount: product.discount || 0,
          subtotal: product.MRP - (product.discount || 0)
        };
        state.items.push(newItem);
      }
      state.total = state.items.reduce((sum, item) => sum + item.subtotal, 0);
    },

    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item && qty > 0) {
        item.quantity = qty;
        item.subtotal = (item.price - item.discount) * qty;
      }
      state.total = state.items.reduce((sum, item) => sum + item.subtotal, 0);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.subtotal, 0);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

export const { addToCart, updateQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
