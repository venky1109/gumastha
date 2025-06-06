// 📁 src/features/orders/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateProductStockOnly } from '../products/productSlice'; 

// Async thunk to create order and order items
export const createOrder = createAsyncThunk(
  'orders/create',
  async ({ payload, token, cartItems }, thunkAPI) => {
    try {
      // Step 1: Create Order
      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_number: `ORD${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`,
          datetime: new Date().toISOString(),
          total_amount: payload.total_amount,
          payment_method: payload.payment_method,
          user_id: payload.user_id,
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.error || 'Order creation failed');

      const orderId = orderData.id;

      // Step 2: Create Order Items
      const orderItemsPayload = cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.id,
        item: item.item,
        catalogQuantity:item.catalogQuantity,
        stock: item.stock,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        subtotal: item.subtotal,
      }));

      const itemsResponse = await fetch('http://localhost:5000/api/order-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderItemsPayload),
      });

      const itemsData = await itemsResponse.json();
      if (!itemsResponse.ok) throw new Error(itemsData.error || 'Order items failed');
       for (const item of cartItems) {
        const newStock = item.stock;
        if (newStock >= 0) {
          await thunkAPI.dispatch(
            updateProductStockOnly({
              id: item.id,
              newQuantity: newStock,
              token,
            })
          );
        }
      }
       
      return { ...orderData, items: itemsData };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


export const fetchLatestOrders = createAsyncThunk(
  'orders/fetchLatest',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/latest');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch latest orders');
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    latest: null,
    recent: [],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.latest = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
           .addCase(fetchLatestOrders.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchLatestOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recent = action.payload;
      })
      .addCase(fetchLatestOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default orderSlice.reducer;
