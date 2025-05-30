
import { useNavigate } from 'react-router-dom';


function Admin() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">👑 Admin Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow-lg p-6 rounded-lg hover:scale-105 transition">
          <h2 className="text-xl font-semibold mb-2">🧑‍💼 User Management</h2>
          <p className="text-gray-600">Manage roles, add/delete users</p>
        </div>
        <div  onClick={() => navigate('/Inventory')} className="bg-white shadow-lg p-6 rounded-lg hover:scale-105 transition">
          <h2 className="text-xl font-semibold mb-2">📦 Product Management</h2>
          <p className="text-gray-600">Add, update, delete products</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg hover:scale-105 transition">
          <h2 className="text-xl font-semibold mb-2">📁 Catalog Management</h2>
          <p className="text-gray-600">Manage categories & master data</p>
        </div>
        <div
  onClick={() => navigate('/pos')}
  className="bg-white shadow-lg p-6 rounded-lg hover:scale-105 transition cursor-pointer"
>
  <h2 className="text-xl font-semibold mb-2">💳 POS Billing</h2>
  <p className="text-gray-600">Perform checkout and billing</p>
</div>
      </div>
      
    </div>
  );
}
export default Admin;
