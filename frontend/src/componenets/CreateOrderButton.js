// 📁 src/components/CreateOrderButton.js
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../features/orders/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
// import { useNavigate } from 'react-router-dom';

function CreateOrderButton({ selectedCustomer }) {
  
    // const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);
  const total = useSelector((state) => state.cart.total || 0);
  // const totalQty = useSelector((state) => state.cart.totalQty || 0);
  // const totalDiscount= useSelector((state) => state.cart.totalDiscount || 0);
  const token = localStorage.getItem('token');
  const openPrintWindow = (order) => {
  const printWindow = window.open('', '_blank', 'width=800,height=900');

  const itemsHTML = order.items.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.item}</td>
      <td>${(item.price ?? 0).toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>${item.discount}%</td>
      <td>${((item.subtotal ?? ((item.price ?? 0) * (item.quantity ?? 0)) * (1 - (item.discount ?? 0) / 100))).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: monospace; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          table, th, td { border: 1px solid black; padding: 5px; text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <h2 style="text-align:center;">🧾 Khush Fashion Palace</h2>
        <p><strong>Invoice #:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.datetime).toLocaleDateString()} 
        <strong>Time:</strong> ${new Date(order.datetime).toLocaleTimeString()}</p>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Description</th><th>Price</th><th>Quantity</th><th>Discount</th><th>Total</th>
            </tr>
          </thead>
          <tbody>${itemsHTML}</tbody>
          <tfoot>
            <tr><td colspan="5" class="text-right">Total Qty:</td><td>${(order.totalQty ?? 0).toFixed(2)}</td></tr>
            <tr><td colspan="5" class="text-right">Total Discount:</td><td>₹ ${(order.totalDiscount ?? 0).toFixed(2)}</td></tr>
            <tr><td colspan="5" class="text-right font-bold">Total:</td><td class="font-bold">₹ ${(order.total ?? 0).toFixed(2)}</td></tr>
          </tfoot>
        </table>
        <p class="text-center" style="margin-top:20px;">Thank you for shopping!</p>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 500);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

//   const fullOrder = {
//   id: Date.now(), // or result.id from backend
//   items: cartItems,
//   total: total,
//   totalQty: totalQty,
//   totalDiscount: totalDiscount,
//   datetime: new Date().toISOString(),
// };
  const handleCreateOrder = async () => {
    if (!selectedCustomer || cartItems.length === 0) {
      alert('Missing customer or items');
      return;
    }
    


    const orderPayload = {
      total_amount: total,
      payment_method: 'Cash',
      user_id: selectedCustomer.id,
    };

try {
  const result = await dispatch(createOrder({ payload: orderPayload, token, cartItems })).unwrap();
  alert(`✅ Order Created: ID ${result.id}`);

  const fullOrder = {
    id: result.id,
    items: cartItems,
    total: result.total || total,
    totalQty: result.totalQty || cartItems.reduce((sum, i) => sum + i.quantity, 0),
    totalDiscount: result.totalDiscount || 0,
    datetime: new Date().toISOString(),
  };

  openPrintWindow(fullOrder);
  dispatch(clearCart());
} catch (err) {
  console.error('❌ Error creating order:', err);
  alert(err.message);
}

  };

  return (
    <button
      onClick={handleCreateOrder}
      className="bg-purple-600 text-white py-2 rounded w-full"
    >
      🧾 Pay All / Generate Invoice
    </button>
  );
}

export default CreateOrderButton;
