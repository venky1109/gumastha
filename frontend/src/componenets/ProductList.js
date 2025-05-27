function ProductList() {
  const products = [
    { name: "LEE SHIRTS", price: 600, qty: 6 },
    { name: "SIGNATURE JEANS", price: 1100, qty: 10 },
    { name: "RD SHOES", price: 1100, qty: 7 },
    // ...add more as needed
  ];

  return (
    <div className="p-4 bg-white border rounded shadow-sm h-full overflow-y-auto">
      <div className="flex justify-between mb-4 gap-2">
        <select className="border px-2 py-1 rounded text-sm w-1/2">
          <option>All Categories</option>
        </select>
        <select className="border px-2 py-1 rounded text-sm w-1/2">
          <option>All Brands</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {products.map((p, index) => (
          <div key={index} className="bg-green-100 border p-2 rounded shadow text-center">
            <div className="text-xs text-red-600 font-semibold">Qty: {p.qty}</div>
            <div className="font-bold">{p.name}</div>
            <div className="text-green-700 font-semibold">₹ {p.price.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
