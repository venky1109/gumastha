import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, fetchProductByBarcode } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';

function ProductList() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  const { all: products = [], loading, error } = useSelector((state) => state.products || {});
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');

  useEffect(() => {
    if (token) dispatch(fetchAllProducts(token));
  }, [dispatch, token]);

  const handleBarcodeScan = async (e) => {
    if (e.key === 'Enter' && barcodeInput.trim()) {
      const scanned = barcodeInput.trim();
      try {
        const result = await dispatch(fetchProductByBarcode({ barcode: scanned, token })).unwrap();
        if (result) {
          dispatch(addToCart(result));
          alert(`✅ ${result.productName} added to cart`);
        } else {
          alert('❌ Product not found');
        }
      } catch (err) {
        alert('❌ Error: ' + err.message);
      } finally {
        setBarcodeInput('');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      categoryFilter === 'all' ||
      (product.categoryName || '').toLowerCase() === categoryFilter;

    const matchBrand =
      brandFilter === 'all' ||
      (product.brand || 'unbranded').toLowerCase() === brandFilter;

    const matchSearch =
      !search || (product.productName || '').toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchBrand && matchSearch;
  });

  const uniqueCategories = [...new Set(products.map((p) => (p.categoryName || '').toLowerCase()).filter(Boolean))];
  const uniqueBrands = [...new Set(products.map((p) => (p.brand || 'unbranded').toLowerCase()))];

  return (
    <div className="p-4 bg-white border rounded shadow-sm h-full overflow-y-auto">
      {/* Barcode Scanner Input */}
      <div className="mb-4">
        <input
          type="text"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          onKeyDown={handleBarcodeScan}
          placeholder="📷 Scan barcode to add"
          className="border p-2 w-full text-lg text-center"
          autoFocus
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="all">All Categories</option>
          {uniqueCategories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="all">All Brands</option>
          {uniqueBrands.map((brand, idx) => (
            <option key={idx} value={brand}>{brand}</option>
          ))}
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search product"
          className="border px-2 py-1 rounded text-sm w-1/3"
        />
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center text-blue-500 font-medium">Loading products...</div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-gray-500 italic">No matching products found.</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => dispatch(addToCart(p))}
              className="bg-green-100 border p-2 rounded shadow text-center cursor-pointer hover:bg-green-200"
            >
              <div className="text-xs text-red-600 font-semibold">Qty: {p.quantity}</div>
              <div className="font-bold text-sm">{p.productName}</div>
              {p.brand && (
                <div className="text-xs text-gray-500 italic">{p.brand}</div>
              )}
              <div className="text-green-700 font-semibold">₹ {p.MRP?.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
