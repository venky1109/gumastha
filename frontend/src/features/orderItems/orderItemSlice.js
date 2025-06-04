import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch items by order_id
export const fetchOrderItemsByOrderId = createAsyncThunk(
  'orderItems/fetchByOrderId',
  async ({ orderId, token }, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:5000/api/order-items/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data)
      if (!response.ok) throw new Error(data.error || 'Failed to fetch order items');
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const orderItemSlice = createSlice({
  name: 'orderItems',
  initialState: {
    items: [],
    loading: false,
    error: '',
  },
  reducers: {
    clearOrderItems: (state) => {
      state.items = [];
      state.loading = false;
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderItemsByOrderId.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchOrderItemsByOrderId.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrderItemsByOrderId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearOrderItems } = orderItemSlice.actions;
export default orderItemSlice.reducer;
