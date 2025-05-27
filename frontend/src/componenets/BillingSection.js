import { useState } from 'react';
import CustomerLookup from './CustomerLookup'; // Make sure path is correct
import { useSelector, useDispatch } from 'react-redux';
import { updateQty, removeFromCart } from '../features/cart/cartSlice';


function BillingSection() {
  const token = localStorage.getItem('token');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const dispatch = useDispatch();
const cartItems = useSelector(state => state.cart.items || []);



  return (
    <div className="p-4 space-y-4">
      <div className="border rounded p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-2">🧾 Sales Invoice</h2>

        {/* ✅ Customer Search Component */}
        <CustomerLookup
          token={token}
          onCustomerFound={(customer) => {
            setSelectedCustomer(customer);
            console.log('✅ Selected Customer:', customer);
          }}
        />
      </div>

      <div className="overflow-x-auto border rounded bg-white shadow-sm">
        <table className="w-full table-auto text-sm">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="p-2">Item</th>
              <th>Stock</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
         <tbody>
  {cartItems.length === 0 ? (
    <tr className="text-center text-gray-600">
      <td className="p-2" colSpan="7">No items added yet</td>
    </tr>
  ) : (
    cartItems.map((item) => (
      <tr key={item.id} className="text-center">
        <td className="p-2 font-medium">{item.item}</td>
        <td>{item.stock}</td>
        <td>
          <input
            type="number"
            value={item.quantity}
            min="1"
            max={item.stock}
            className="w-14 border rounded px-1 text-center"
            onChange={(e) => dispatch(updateQty({ id: item.id, qty: parseInt(e.target.value) }))}
          />
        </td>
        <td>₹ {item.price}</td>
        <td> {item.discount} %</td>
        <td className="text-green-700 font-semibold">₹ {item.subtotal.toFixed(2)}</td>
        <td>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => dispatch(removeFromCart(item.id))}
          >
            🗑️
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>


        </table>
      </div>

      <div className="flex justify-between items-center mt-2">
        <label className="flex items-center text-sm gap-2">
          <input type="checkbox" className="accent-blue-600" />
          Send SMS to Customer
        </label>

        <input
          placeholder="Other Charges"
          className="border px-2 py-1 text-sm rounded w-32"
        />
      </div>

      <div className="grid grid-cols-4 gap-2 mt-2">
        <button className="bg-pink-600 text-white py-2 rounded">Hold</button>
        <button className="bg-blue-600 text-white py-2 rounded">Multiple</button>
        <button className="bg-green-600 text-white py-2 rounded">Cash</button>
        <button className="bg-purple-600 text-white py-2 rounded">Pay All</button>
      </div>

      {/* Optional: show customer summary */}
      {selectedCustomer && (
        <div className="text-sm text-gray-700 bg-blue-50 border rounded px-3 py-2 mt-4">
          <p><strong>Customer:</strong> {selectedCustomer.name} ({selectedCustomer.phone})</p>
          {selectedCustomer.email && <p><strong>Email:</strong> {selectedCustomer.email}</p>}
          {selectedCustomer.address && <p><strong>Address:</strong> {selectedCustomer.address}</p>}
        </div>
      )}
    </div>
  );
}

export default BillingSection;
