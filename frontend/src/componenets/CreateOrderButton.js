// 📁 src/components/CreateOrderButton.js
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../features/orders/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
import { fetchCustomerByPhone, createCustomer  } from '../features/customers/customerSlice';
// import { useNavigate } from 'react-router-dom';

function CreateOrderButton({ selectedCustomer ,setSelectedCustomer  }) {
  const now = new Date();
const formattedDate = now.toLocaleDateString(); // e.g. "6/4/2025"
const formattedTime = now.toLocaleTimeString(); // e.g. "12:30:15 PM"

  
    // const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);
  const total = useSelector((state) => state.cart.total || 0);

  const token = localStorage.getItem('token');

const openPrintWindow = (order) => {
  const printWindow = window.open('', '_blank', 'width=393,height=600');

  const itemsHTML = order.items.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.item}</td>
      <td>${item.catalogQuantity || ''}</td>
      <td>${(item.price ?? 0).toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>${item.discount}%</td>
      <td>${parseFloat(
        item.subtotal ??
        ((item.price ?? 0) * (item.quantity ?? 0)) *
        (1 - (item.discount ?? 0) / 100)
      ).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
<html>
  <head>
    <title>Invoice</title>
    <style>
      body {
        font-family: monospace;
        padding: 10px;
        font-size: 12px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      table, th, td {
        border: 1px solid black;
        padding: 4px;
        text-align: center;
      }
      .text-right {
        text-align: right;
        padding-right: 6px;
      }
      .font-bold {
        font-weight: bold;
      }
      .center {
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="center" style="margin-bottom: 12px;">
      <h2 class="text-base font-bold">${process.env.REACT_APP_SHOP_NAME}</h2>
      <p>
        ${process.env.REACT_APP_SHOP_ADDRESS_LINE1}<br />
        ${process.env.REACT_APP_SHOP_ADDRESS_LINE2}<br />
        ${process.env.REACT_APP_SHOP_GST}<br />
        ${process.env.REACT_APP_SHOP_VAT}<br />
        ${process.env.REACT_APP_SHOP_PHONE}
      </p>
      <p class="font-bold">Invoice #: ${order.order_number || order.id}</p>
      <p>Name: Walk-in customer</p>
      <p>Seller: ${process.env.REACT_APP_INVOICE_SELLER}</p>
      <p>Date: ${formattedDate} &nbsp;&nbsp; Time: ${formattedTime}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Discount</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6" class="text-right">Total Qty:</td>
          <td>${(order.totalQty ?? 0).toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="6" class="text-right">Total Discount:</td>
          <td>₹ ${(order.totalDiscount ?? 0).toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="6" class="text-right font-bold">Total:</td>
          <td class="font-bold">₹ ${(order.total ?? 0).toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>

    <p class="center" style="margin-top: 16px;">Thank you for shopping!</p>

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
  
const handleCreateOrder = async () => {
  if (cartItems.length === 0) {
    alert('Cart is empty. Please add items.');
    return;
  }

  let customer = selectedCustomer;
  // const token = localStorage.getItem('token');

  if (!customer) {
    const phone = prompt('Enter customer mobile number:');
    if (!phone) {
      alert('Phone number is required');
      return;
    }

    // 1. Try to fetch existing customer
    try {
      const result = await dispatch(fetchCustomerByPhone({ phone, token })).unwrap();
      customer = result;
    } catch (error) {
      // 2. If not found, collect additional details and create new customer
let name = prompt('Enter customer name:')?.trim();
let address = prompt('Enter customer address:')?.trim();
let email = prompt('Enter customer email (optional):')?.trim() || 'NA';

// Assign "NA" if fields are empty
name = name || 'NA';
address = address || 'NA';


      try {
        const result = await dispatch(createCustomer({ name, phone, email, address, token })).unwrap();
        customer = result;
      } catch (err) {
        alert('Failed to create customer: ' + err.message);
        return;
      }
    }
    
  }
    const orderPayload = {
    total_amount: total,
    payment_method: 'Cash',
    user_id: customer.id,
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
  // setSelectedCustomer(null);
  setSelectedCustomer(null);
console.log('Customer cleared!');
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
