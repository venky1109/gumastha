import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../features/products/productSlice';
import { fetchCatalogs } from '../features/catalogs/catalogSlice';
import { Outlet } from 'react-router-dom';
// import CatalogForm from '../componenets/CatalogForm';
// import ProductForm from '../componenets/ProductForm';
import Sidebar from '../componenets/Sidebar';
import { useAuth } from '../context/AuthContext';

function Inventory() {
  const dispatch = useDispatch();
  const { token } = useAuth();
  // console.log(token);

  const { all: products = [], loading, error } = useSelector((state) => state.products || {});
  const { all: catalogs = [] } = useSelector((state) => state.catalogs || {});

  const [activeForm, setActiveForm] = useState('catalog'); // Default tab
  const [openSubMenu, setOpenSubMenu] = useState('items');
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(fetchAllProducts(token));
      dispatch(fetchCatalogs({ token }));
    }
  }, [dispatch, token]);

  const filteredProducts = products.filter((product) => {
    const matchBrand = !brandFilter || product.brand?.toLowerCase() === brandFilter.toLowerCase();
    const matchCategory = !categoryFilter || product.categoryName?.toLowerCase() === categoryFilter.toLowerCase();
    return matchBrand && matchCategory;
  });

  const uniqueBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const uniqueCategories = [...new Set(products.map((p) => p.categoryName).filter(Boolean))];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onSelect={(type) => setActiveForm(type)}
        openSubMenu={openSubMenu}
        setOpenSubMenu={setOpenSubMenu}
      />

      <div className="p-4 flex-1 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">📦 Inventory Management</h2>



        <Outlet />


        {/* ✅ Filters */}
        <div className="flex gap-4 my-4">
          <select
            className="border p-2 rounded"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="">All Brands</option>
            {uniqueBrands.map((brand, idx) => (
              <option key={idx} value={brand}>{brand}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* ✅ Product Table */}
       {activeForm === 'product' && (
  <>
    {/* ✅ Filters for Product */}
    <div className="flex gap-4 my-4">
      <select
        className="border p-2 rounded"
        value={brandFilter}
        onChange={(e) => setBrandFilter(e.target.value)}
      >
        <option value="">All Brands</option>
        {uniqueBrands.map((brand, idx) => (
          <option key={idx} value={brand}>{brand}</option>
        ))}
      </select>

      <select
        className="border p-2 rounded"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        {uniqueCategories.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>
    </div>

    {/* ✅ Product Table */}
    <div className="mt-4 border border-gray-300 rounded-lg shadow-sm bg-white p-4">
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
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Min Qty</th>
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
                  <td className="p-2 border">₹ {Number(item.purchasePrice || 0).toFixed(2)}</td>
                  <td className="p-2 border">₹ {Number(item.MRP || 0).toFixed(2)}</td>
                  <td className="p-2 border">₹ {Number(item.sellingPrice || 0).toFixed(2)}</td>
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
  </>
)}

{activeForm === 'catalog' && (
  <div className="mt-4 border border-gray-300 rounded-lg shadow-sm bg-white p-4">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">📁 Catalog Table</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Subcategory</th>
            <th className="p-2 border">Product Name</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Brand</th>
            <th className="p-2 border">Description</th>
          </tr>
        </thead>
        <tbody>
          {catalogs.length === 0 ? (
            <tr><td colSpan="7" className="italic text-center text-gray-500 p-4">No catalog items found</td></tr>
          ) : (
            catalogs.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-2 border">{item.id}</td>
                <td className="p-2 border">{item.categoryName}</td>
                <td className="p-2 border">{item.subcategoryName}</td>
                <td className="p-2 border">{item.productName}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">{item.brand}</td>
                <td className="p-2 border">{item.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default Inventory;
