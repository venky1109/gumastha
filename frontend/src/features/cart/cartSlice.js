// 📁 features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) return undefined;
    return JSON.parse(serializedCart);
  } catch (e) {
    console.warn('Failed to load cart from storage:', e);
    return undefined;
  }
};

const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save cart to storage:', e);
  }
};

const initialState = loadCartFromStorage() || {
  items: [],
  total: 0,
  totalQty: 0,
  totalDiscount: 0
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
        existing.subtotal = parseFloat(((existing.price - discountAmount) * existing.quantity).toFixed(2));
      } else {
        const discount = product.discount || 0;
        const discountAmount = product.MRP * (discount / 100);
        const subtotal = parseFloat((product.MRP - discountAmount).toFixed(2));

        const newItem = {
          id: product.id,
          item: product.productName,
          stock: parseInt(product.quantity),
          quantity: 1,
          price: product.MRP,
          discount: discount, // Keep % value
          subtotal: subtotal
        };
        state.items.push(newItem);
      }

      // ✅ Recalculate totals
      state.total = 0;
      state.totalQty = 0;
      state.totalDiscount = 0;

      for (const item of state.items) {
        const itemDiscountAmount = item.price * (item.discount / 100);
        state.total += (item.price - itemDiscountAmount) * item.quantity;
        state.totalQty += item.quantity;
        state.totalDiscount += itemDiscountAmount * item.quantity;
      }

      state.total = parseFloat(state.total.toFixed(2));
      state.totalDiscount = parseFloat(state.totalDiscount.toFixed(2));
      saveCartToStorage(state);
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find(i => i.id === id);

      if (item && qty > 0) {
        const discountAmount = item.price * (item.discount / 100);
        item.quantity = qty;
        item.subtotal = parseFloat(((item.price - discountAmount) * qty).toFixed(2));
      }

      // Recalculate totals after quantity update
      state.total = 0;
      state.totalQty = 0;
      state.totalDiscount = 0;

      for (const item of state.items) {
        const itemDiscountAmount = item.price * (item.discount / 100);
        state.total += (item.price - itemDiscountAmount) * item.quantity;
        state.totalQty += item.quantity;
        state.totalDiscount += itemDiscountAmount * item.quantity;
      }

      state.total = parseFloat(state.total.toFixed(2));
      state.totalDiscount = parseFloat(state.totalDiscount.toFixed(2));
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.subtotal, 0);
      state.total = parseFloat(state.total.toFixed(2));
    //   state.totalDiscount=state.items.reduce((sum,item)=> sum + item.discountAmount,0)
      state.totalDiscount = state.items.reduce(
  (sum, item) => sum + (item.price * (item.discount / 100) * item.quantity),
  0
);
state.totalDiscount = parseFloat(state.totalDiscount.toFixed(2));

      state.totalQty=state.items.reduce((sum,item)=> sum + item.quantity,0)
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.totalQty = 0;
      state.totalDiscount = 0;
      localStorage.removeItem('cart');
    }
  }
});

export const { addToCart, updateQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
