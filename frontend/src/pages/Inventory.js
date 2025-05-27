function Inventory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 p-10">
      <h1 className="text-4xl font-bold text-green-800 mb-6">🏷️ Inventory Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <div className="bg-white shadow-md p-6 rounded-lg hover:bg-green-50">
          <h2 className="text-lg font-semibold">📦 Product Management</h2>
          <p>Update quantity, pricing, and stock</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg hover:bg-green-50">
          <h2 className="text-lg font-semibold">📁 Catalog Management</h2>
          <p>Edit categories and master product info</p>
        </div>
      </div>
    </div>
  );
}
export default Inventory;
