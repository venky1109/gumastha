import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CustomerLookup from './CustomerLookup';
import { updateQty, removeFromCart } from '../features/cart/cartSlice';
import CreateOrderButton from './CreateOrderButton';
// import PrintableInvoice from './PrintableInvoice';
// import { useNavigate } from 'react-router-dom';


function BillingSection() {
  const token = localStorage.getItem('token');
  const [resetCustomerLookup, setResetCustomerLookup] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const dispatch = useDispatch();
    // const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items || []);
  const cartTotal = useSelector(state => state.cart.total || 0);
  const cartTotalQty = useSelector(state => state.cart.totalQty || 0);
  const cartTotalDiscount = useSelector(state => state.cart.totalDiscount || 0);
  const cartTotalRaw = useSelector(state => state.cart.totalRawAmount || 0);

  // const latestOrder = useSelector(state => state.cart); // ✅ from orderSlice

  return (
    <div className="p-4 space-y-4">
      <div className="border rounded p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-2">🧾 Sales Invoice</h2>

      <CustomerLookup
  token={token}
  reset={resetCustomerLookup}
  onCustomerFound={(customer) => {
    setSelectedCustomer(customer);
    setResetCustomerLookup(false); // ✅ stop resetting after update
    console.log('✅ Selected Customer:', customer);
  }}
/>


      </div>

      {/* Item Table */}
      <div className="overflow-x-auto border rounded bg-white shadow-sm">
        <table className="w-full table-auto text-sm">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="p-2">Item</th>
              <th>Quantity</th>
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
                  <td>{item.catalogQuantity}</td>
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
                  <td>{item.discount} %</td>
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

      {/* Totals */}
      <div className="bg-gray-200 p-3 rounded shadow-sm grid grid-cols-4 gap-2 items-center text-center text-sm font-medium">
        <div>
          <div className="text-gray-600">Quantity:</div>
          <div className="text-black text-lg">{cartTotalQty}</div>
        </div>
        <div>
          <div className="text-gray-600">Total Amount:</div>
          <div className="text-black text-lg">₹ {cartTotalRaw.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-600">Total Discount:</div>
          <div className="text-black text-lg">₹ {cartTotalDiscount.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-600">Discounted Total:</div>
          <div className="text-black text-lg">₹ {cartTotal.toFixed(2)}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-2">
        <label className="flex items-center text-sm gap-2">
          <input type="checkbox" className="accent-blue-600" />
          Send SMS to Customer
        </label>
        <input placeholder="Other Charges" className="border px-2 py-1 text-sm rounded w-32" />
      </div>

      <div className="grid grid-cols-4 gap-2 mt-2">
        <button className="bg-pink-600 text-white py-2 rounded">Hold</button>
        <button className="bg-blue-600 text-white py-2 rounded">Multiple</button>
        <button className="bg-green-600 text-white py-2 rounded">Cash</button>
        
       
    <CreateOrderButton
  selectedCustomer={selectedCustomer}
  setSelectedCustomer={(customer) => {
    if (!customer) setResetCustomerLookup(true);
    setSelectedCustomer(customer);
  }}
  
/>




      </div>

      {selectedCustomer && (
        <div className="text-sm text-gray-700 bg-blue-50 border rounded px-3 py-2 mt-4">
          <p><strong>Customer:</strong> {selectedCustomer.name} ({selectedCustomer.phone})</p>
          {selectedCustomer.email && <p><strong>Email:</strong> {selectedCustomer.email}</p>}
          {selectedCustomer.address && <p><strong>Address:</strong> {selectedCustomer.address}</p>}
        </div>
      )}
      {/* <button
  onClick={() => {
    if (!latestOrder) {
      alert("Invoice not ready");
      return;
    }
    navigate('/print-invoice', { state: { order: latestOrder } });
  }}
  className="mt-4 bg-black text-white px-4 py-2 rounded"
>
  🖨️ Print Invoice
</button> */}

      {/* ✅ Print Preview
      {latestOrder && (
        <div className="mt-6 border p-4 bg-white shadow-lg rounded">
          <PrintableInvoice order={latestOrder} />
        <button
  onClick={() => {
    const invoice = document.getElementById('invoice');
    if (!invoice) {
      alert('Invoice not ready');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=900');

    const styles = `
      <style>
        body { font-family: monospace; padding: 20px; }
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
          padding: 5px;
          text-align: center;
        }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
      </style>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          ${styles}
        </head>
        <body>
          ${invoice.outerHTML}
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.close();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }}
  className="mt-4 bg-black text-white px-4 py-2 rounded"
>
  🖨️ Print Invoice
</button>        
        </div>
      )} */}
    </div>
  );
}

export default BillingSection;
