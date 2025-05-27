import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 📦 Fetch customer by phone
export const fetchCustomerByPhone = createAsyncThunk(
  'customers/fetchByPhone',
  async ({ phone, token }, thunkAPI) => {
    const res = await fetch(`http://localhost:5000/api/customers/phone/${phone}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Customer fetch failed');
    return data;
  }
);

// ➕ Create new customer
export const createCustomer = createAsyncThunk(
  'customers/create',
  async ({ name, phone, email, address, token }, thunkAPI) => {
    const res = await fetch(`http://localhost:5000/api/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, phone, email, address })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Customer creation failed');
    return data;
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customer: null,
    loading: false,
    error: ''
  },
  reducers: {
    clearCustomer: (state) => {
      state.customer = null;
      state.error = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerByPhone.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchCustomerByPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(fetchCustomerByPhone.rejected, (state, action) => {
        state.loading = false;
        state.customer = null;
        state.error = action.error.message;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customer = action.payload;
        state.error = '';
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const { clearCustomer } = customerSlice.actions;
export default customerSlice.reducer;
