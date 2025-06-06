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
export const addProduct = createAsyncThunk(
  'products/add',
  async ({ payload, token }) => {
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add product');
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
    // console.log('123'+JSON.stringify(data));
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
// PUT /api/products/:id with updated quantity (new stock)
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data, token }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update product');
      return result;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateProductStockOnly = createAsyncThunk(
  'products/updateStockOnly',
  async ({ id, newQuantity, token }, thunkAPI) => {
    const res = await fetch(`http://localhost:5000/api/products/stock/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update stock');
    return data;
  }
);
// Async thunk
export const fetchProductByCatalogId = createAsyncThunk(
  'products/fetchByCatalogId',
  async ({ catalogId, token }) => {
    const res = await fetch(`http://localhost:5000/api/products/catalog/${catalogId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Product not found by catalogId');
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
    })
    .addCase(updateProductStockOnly.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.all.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        state.all[index].quantity = updated.quantity;
      }
    })
    .addCase(updateProductStockOnly.rejected, (state, action) => {
      state.error = action.payload || 'Stock update failed';
    })
    .addCase(fetchProductByCatalogId.pending, (state) => {
  state.loading = true;
  state.error = '';
})
.addCase(fetchProductByCatalogId.fulfilled, (state, action) => {
  state.loading = false;
  state.selected = action.payload;
})
.addCase(fetchProductByCatalogId.rejected, (state, action) => {
  state.loading = false;
  state.selected = null;
  state.error = action.error.message;
});

}

});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
