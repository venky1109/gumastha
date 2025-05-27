import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (token) => {
    const res = await fetch('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log('📦 products received:', data); // ✅ confirm this is an array
    if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
    return data;
  }
);


export const fetchProductByBarcode = createAsyncThunk(
  'products/fetchByBarcode',
  async ({ barcode, token }) => {
    const res = await fetch(`http://localhost:5000/api/products/barcode/${barcode}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Product not found');
    return data;
  }
);

export const suggestProducts = createAsyncThunk(
  'products/suggest',
  async ({ query, token }) => {
    const res = await fetch(`http://localhost:5000/api/products/suggest?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Suggest fetch failed');
    return data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    all: [],
    selected: null,
    suggestions: [],
    loading: false,
    error: ''
  },
  reducers: {
    clearProduct: (state) => {
      state.selected = null;
      state.suggestions = [];
      state.error = '';
    }
  },
  extraReducers: (builder) => {
  builder
    .addCase(fetchAllProducts.pending, (state) => {
      state.loading = true;
      state.error = '';
    })
    .addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.all = action.payload; // ✅ This is the missing line
    })
    .addCase(fetchAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.all = [];
      state.error = action.error.message;
    })

    .addCase(fetchProductByBarcode.pending, (state) => {
      state.loading = true;
      state.error = '';
    })
    .addCase(fetchProductByBarcode.fulfilled, (state, action) => {
      state.loading = false;
      state.selected = action.payload;
    })
    .addCase(fetchProductByBarcode.rejected, (state, action) => {
      state.loading = false;
      state.selected = null;
      state.error = action.error.message;
    })

    .addCase(suggestProducts.fulfilled, (state, action) => {
      state.suggestions = action.payload;
    });
}

});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
