import React from 'react';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQty, removeFromCart } from '../features/cart/cartSlice';
import CreateOrderButton from './CreateOrderButton';
import { fetchLatestOrders } from '../features/orders/orderSlice';
import { fetchOrderItemsByOrderId } from '../features/orderItems/orderItemSlice';


function BillingSection() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items || []);
  const cartTotal = useSelector(state => state.cart.total || 0);
  const cartTotalQty = useSelector(state => state.cart.totalQty || 0);
  const cartTotalDiscount = useSelector(state => state.cart.totalDiscount || 0);
  const cartTotalRaw = useSelector(state => state.cart.totalRawAmount || 0);
   const token = localStorage.getItem('token');
    const recentOrders = useSelector((state) => state.orders.recent);
    

    useEffect(() => {
    dispatch(fetchLatestOrders());
  }, [dispatch]);
const handleClick = (orderId) => {
  console.log(orderId)
  dispatch(fetchOrderItemsByOrderId({ orderId, token }));
};

const orderItems = useSelector((state) => state.orderItems.items || []);


  return (
    <div className="p-4 space-y-4">
      
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
              <th>Amount</th>
              <th>Bin</th>
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
                      max={item.catalogQuantity}
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
  
/>




      </div>

    {/* Latest Orders Table */}
<div className="mt-6">
  <h2 className="text-sm font-bold mb-2 text-gray-700">Latest Orders</h2>
  <div className="overflow-x-auto">
    <table className="w-full text-sm bg-white border shadow-sm rounded">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-2 border-b">#</th>
          <th className="p-2 border-b">Order No</th>
          <th className="p-2 border-b">Amount</th>
          <th className="p-2 border-b">Phone</th>
        </tr>
      </thead>
      <tbody>
        {recentOrders.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center py-3 text-gray-500">
              No recent orders
            </td>
          </tr>
        ) : (
          recentOrders.map((order, index) => (
            <React.Fragment key={order.id}>
              <tr
                className="cursor-pointer hover:bg-blue-50 transition"
                onClick={() => handleClick(order.id)}
>
                <td className="p-2 border-b">{index + 1}</td>
                <td className="p-2 border-b font-medium">#{order.order_number}</td>
                <td className="p-2 border-b">₹ {order.total_amount}</td>
                <td className="p-2 border-b">{order.customer_phone || 'NA'}</td>
              </tr>
            </React.Fragment>
          ))
        )}
      </tbody>
    </table>
   {orderItems.length > 0 ? (
  <div className="mt-4 bg-white p-4 rounded shadow-sm">
    <h3 className="text-sm font-bold mb-2 text-gray-700">Order Items</h3>
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Item</th>
          <th className="p-2 border">Qty</th>
          <th className="p-2 border">Price</th>
          <th className="p-2 border">Amount</th>
        </tr>
      </thead>
      <tbody>
        {orderItems.map((item, index) => (
          <tr key={index}>
            <td className="p-2 border">{item.item}</td>
            <td className="p-2 border">{item.quantity}</td>
            <td className="p-2 border">₹ {item.price}</td>
            <td className="p-2 border">₹ {item.subtotal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-sm text-gray-400 mt-2">No items to display.</p>
)}


  </div>
</div>

    </div>
    
  );
}

export default BillingSection;
