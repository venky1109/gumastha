import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, addProduct } from '../features/products/productSlice';
import { fetchCatalogs, addCatalog } from '../features/catalogs/catalogSlice';

function Inventory() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  const { all: products = [], loading, error } = useSelector((state) => state.products || {});
  const { all: catalogs = [] } = useSelector((state) => state.catalogs || {});

  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showCatalogForm, setShowCatalogForm] = useState(false);
  const [catalogSuggestions, setCatalogSuggestions] = useState([]);

 const [newProduct, setNewProduct] = useState({
  catalogId: '',
  barcodeInput: '',      // <-- Temporary barcode entry
  barcodes: [],          // <-- Actual barcode array
  quantity: 0,
  MRP: '', sellingPrice: '', discount: '',
  purchasePrice: '', warranty: '', importedYear: '', productDetails: '',
  couponCodes: '', promotionCodes: '', keywords: ''
});

  const [newCatalog, setNewCatalog] = useState({
    categoryName: '', subcategoryName: '', productName: '', quantity: '', description: '', brand: ''
  });

  useEffect(() => {
  if (token) {
    dispatch(fetchAllProducts(token));
    dispatch(fetchCatalogs({ token }));

  }
}, [dispatch, token]);

useEffect(() => {
  console.log("📚 catalogs:", catalogs);
}, [catalogs]);


  const filteredProducts = products.filter((product) => {
    const matchBrand = !brandFilter || product.brand?.toLowerCase() === brandFilter.toLowerCase();
    const matchCategory = !categoryFilter || product.categoryName?.toLowerCase() === categoryFilter.toLowerCase();
    return matchBrand && matchCategory;
  });



const uniqueBrands = useMemo(() => {
  return [...new Set(products.map(p => p.brand).filter(Boolean))];
}, [products]);

const uniqueCategories = useMemo(() => {
  return [...new Set(products.map(p => p.categoryName).filter(Boolean))];
}, [products]);


  const handleProductNameInput = (e) => {
    const input = e.target.value.toLowerCase();
  const matches = catalogs
  .filter(c => c?.productName?.toLowerCase().includes(input))
 .map(c => `${c.id} - ${c.productName}`);


    setCatalogSuggestions(matches);
    setNewProduct(prev => ({ ...prev, productDetails: e.target.value }));
    console.log("🔍 Matching catalog suggestions:", matches);

  };

 const handleSuggestionClick = (suggestion) => {
  const [catalogId, productName] = suggestion.split(' - ');
  setNewProduct(prev => ({
    ...prev,
    catalogId: catalogId.trim(),
    productDetails: productName.trim()
  }));
  setCatalogSuggestions([]);
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedProduct = { ...newProduct, [name]: value };

    const MRP = parseFloat(name === 'MRP' ? value : updatedProduct.MRP);
    const discount = parseFloat(name === 'discount' ? value : updatedProduct.discount);
    const sellingPrice = parseFloat(name === 'sellingPrice' ? value : updatedProduct.sellingPrice);

    if ((name === 'sellingPrice' || name === 'MRP') && !isNaN(MRP) && !isNaN(sellingPrice)) {
      updatedProduct.discount = ((MRP - sellingPrice) / MRP * 100).toFixed(2);
    }

    if ((name === 'discount' || name === 'MRP') && !isNaN(MRP) && !isNaN(discount)) {
      updatedProduct.sellingPrice = (MRP - (MRP * discount / 100)).toFixed(2);
    }

    setNewProduct(updatedProduct);
  };

  const handleCatalogChange = (e) => {
    const { name, value } = e.target;
    setNewCatalog(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...newProduct,
      // barcodes: newProduct.barcodes.split(',').map(b => b.trim()),
      barcodes: newProduct.barcodes,
      couponCodes: newProduct.couponCodes.split(',').map(c => c.trim()),
      promotionCodes: newProduct.promotionCodes.split(',').map(p => p.trim()),
      keywords: newProduct.keywords.split(',').map(k => k.trim())
    };
    try {
      await dispatch(addProduct({ payload, token })).unwrap();
      alert('Product added successfully!');
      setShowForm(false);
      dispatch(fetchAllProducts(token));

      
    // ✅ Clear product form inputs here
    setNewProduct({
      catalogId: '',
      barcodeInput: '',
      barcodes: [],
      quantity: 0,
      MRP: '',
      sellingPrice: '',
      discount: '',
      purchasePrice: '',
      warranty: '',
      importedYear: '',
      productDetails: '',
      couponCodes: '',
      promotionCodes: '',
      keywords: ''
    });

    // Optional: clear suggestions too
    setCatalogSuggestions([]);
    } catch (err) {
      console.error('Failed to add product:', err);
      alert('Failed to add product');
    }
  };

 const handleCatalogSubmit = async (e) => {
  e.preventDefault();
  console.log("📤 Catalog payload before sending:", newCatalog); // <-- Add this log

  try {
    await dispatch(addCatalog({ payload: newCatalog, token })).unwrap();
    alert('Catalog added successfully!');
    setShowCatalogForm(false);
    dispatch(fetchCatalogs(token));
  } catch (err) {
    console.error('Failed to add catalog:', err); // <-- already present
    alert('Failed to add catalog');
  }
};


  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📦 Items List</h2>

      <div className="mb-4 flex gap-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowCatalogForm(!showCatalogForm)}>
          {showCatalogForm ? 'Close Catalog Form' : '+ New Catalog'}
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Product Form' : '+ New Product'}
        </button>
      </div>

      {showCatalogForm && (
        <div className="border border-gray-300 p-4 rounded-lg shadow-sm bg-gray-50 mb-6">
          <h2 className="text-lg font-semibold text-green-700 mb-4">📦 Add Catalog Details</h2>
          <form className="grid grid-cols-2 gap-4" onSubmit={handleCatalogSubmit}>
            <input name="categoryName" onChange={handleCatalogChange} placeholder="Category Name" className="border p-2" required />
            <input name="subcategoryName" onChange={handleCatalogChange} placeholder="Subcategory Name" className="border p-2" />
            <input name="productName" onChange={handleCatalogChange} placeholder="Product Name" className="border p-2" required />
            <input name="quantity" onChange={handleCatalogChange} placeholder="Unit (e.g. 1kg, 500ml)" className="border p-2" required />
            <input name="description" onChange={handleCatalogChange} placeholder="Description" className="border p-2 col-span-2" />
            <input name="brand" onChange={handleCatalogChange} placeholder="Brand" className="border p-2" />
            <div className="col-start-2 text-right">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Catalog</button>
            </div>
          </form>
        </div>
      )}

      {showForm && (
        <div className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white mb-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">➕ Add Product Details</h2>
          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <input name="catalogId" onChange={handleChange} placeholder="Catalog ID" className="border p-2" value={newProduct.catalogId} />
            {/* <input name="barcodes" onChange={handleChange} placeholder="Barcodes (comma-separated)" className="border p-2" required /> */}
            <input
    name="barcodeInput"
    placeholder="Scan barcode (auto-submit disabled)"
    className="border p-2 w-full"
    value={newProduct.barcodeInput}
    onChange={(e) => setNewProduct(prev => ({ ...prev, barcodeInput: e.target.value }))}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // ⛔️ prevent form submit
        const code = newProduct.barcodeInput.trim();
        if (code && !newProduct.barcodes.includes(code)) {
          setNewProduct(prev => ({
            ...prev,
            barcodes: [...prev.barcodes, code],
            barcodeInput: ''
          }));
        }
      }
    }}
  />
  {newProduct.barcodes.length > 0 && (
    <div className="mt-2 p-2 bg-gray-100 rounded">
      <strong>Scanned Barcodes:</strong>
      <ul className="list-disc list-inside text-sm mt-1">
        {newProduct.barcodes.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  )}
            <input name="purchasePrice" type="number" step="0.01" onChange={handleChange} placeholder="Purchase Price" className="border p-2" value={newProduct.purchasePrice} />
            <input name="MRP" type="number" step="0.01" onChange={handleChange} placeholder="MRP" className="border p-2" value={newProduct.MRP} />
            <input name="sellingPrice" type="number" step="0.01" onChange={handleChange} placeholder="Selling Price" className="border p-2" value={newProduct.sellingPrice} />
            <input name="discount" type="number" step="0.01" onChange={handleChange} placeholder="Discount (%)" className="border p-2" value={newProduct.discount} />
            <input name="quantity" type="number" onChange={handleChange} placeholder="Quantity" className="border p-2" />
            <input name="warranty" onChange={handleChange} placeholder="Warranty" className="border p-2" />
            <input name="importedYear" type="number" onChange={handleChange} placeholder="Imported Year" className="border p-2" />

            {/* Product name with suggestions */}
            <div className="relative col-span-2">
              <input
                name="productDetails"
                placeholder="Search Product Name"
                className="border p-2 w-full"
                value={newProduct.productDetails}
                onChange={handleProductNameInput}
                autoComplete="off"
              />
              {catalogSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full shadow-sm max-h-40 overflow-y-auto">
                  {catalogSuggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input name="couponCodes" onChange={handleChange} placeholder="Coupon Codes (comma-separated)" className="border p-2" />
            <input name="promotionCodes" onChange={handleChange} placeholder="Promotion Codes (comma-separated)" className="border p-2" />
            <input name="keywords" onChange={handleChange} placeholder="Keywords (comma-separated)" className="border p-2" />
            <div className="col-start-2 text-right">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <select className="border p-2 rounded" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
          <option value="">All Brands</option>
          {uniqueBrands.map((brand, idx) => <option key={idx} value={brand}>{brand}</option>)}
        </select>

        <select className="border p-2 rounded" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {uniqueCategories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="mt-8 border border-gray-300 rounded-lg shadow-sm bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 Product Inventory Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Item Code</th>
                <th className="p-2 border">Item Name</th>
                <th className="p-2 border">Brand</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Unit</th>
                <th className="p-2 border">Stock Qty.</th>
                <th className="p-2 border">Min Qty.</th>
                <th className="p-2 border">Purchase Price</th>
                <th className="p-2 border">MRP</th>
                <th className="p-2 border">Selling Price</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="11" className="text-center p-4">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="11" className="text-red-600 p-4">{error}</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="11" className="italic text-center text-gray-500 p-4">No items found</td></tr>
              ) : (
                filteredProducts.map((item, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="p-2 border">{item.sku || `SKU-${item.id}`}</td>
                    <td className="p-2 border">{item.productName}</td>
                    <td className="p-2 border">{item.brand}</td>
                    <td className="p-2 border">{item.categoryName}</td>
                    <td className="p-2 border">{item.catalogQuantity || 'Unit'}</td>
                    <td className="p-2 border">{item.quantity || 0}</td>
                    <td className="p-2 border">{item.minQty || 5}</td>
                    <td className="p-2 border">₹ {item.purchasePrice?.toFixed(2) || 'N/A'}</td>
                    <td className="p-2 border">₹ {item.MRP?.toFixed(2) || 'N/A'}</td>
                    <td className="p-2 border">₹ {item.sellingPrice?.toFixed(2) || 'N/A'}</td>
                    <td className="p-2 border">
                      <span className="px-2 py-1 rounded bg-green-100 text-green-700">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
