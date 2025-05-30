// 📁 src/components/PrintableInvoice.js
import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // or use QRCodeCanvas


function PrintableInvoice({ order }) {
  if (!order) return null;
    const items = Array.isArray(order.items) ? order.items : [];
    console.log('🧾 Items:', order);
  const date = new Date(order.datetime);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();

  return (
    <div id="invoice" className="p-6 font-mono text-sm bg-white text-black w-[600px] mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">Khush Fashion Palace</h2>
        <p>AP: Ankali<br />
          Belgaum - 591201<br />
          GST Number: GSTIN123456780<br />
          VAT Number: VAT123<br />
          Phone: 9999999999, 8888888888
        </p>
        <h3 className="my-2 border-y border-black py-1 font-bold">----------------Invoice----------------</h3>
        <p><strong>Invoice:</strong> #{order.order_number || order.id}</p>
        <p><strong>Name:</strong> Walk-in customer</p>
        <p><strong>Seller:</strong> Admin</p>
        <p><strong>Date:</strong> {formattedDate} &nbsp;&nbsp; <strong>Time:</strong> {formattedTime}</p>
      </div>

      {/* Item Table */}
      <table className="w-full border border-black mb-4">
        <thead>
          <tr className="border-b border-black">
            <th>#</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
       <tbody>
  {items
  .map((item, index) => (
    <tr key={index} className="text-center border-b border-gray-300">
      <td>{index + 1}</td>
      <td>{item.item}</td>
      <td>{(item.price ?? 0).toFixed(2)}</td>
      <td>{item.quantity}</td>
      <td>{item.discount}%</td>
      <td>
        {(
          item.subtotal ??
          ((item.price ?? 0) * (item.quantity ?? 0)) * (1 - (item.discount ?? 0) / 100)
        ).toFixed(2)}
      </td>
    </tr>
    
  ))}
</tbody>
 <tfoot>
    <tr>
      <td colSpan="5" className="text-right pr-2 font-semibold">Sub Total Amount:</td>
      <td>₹ {order.total.toFixed(2)}</td>
    </tr>
    <tr>
      <td colSpan="5" className="text-right pr-2 font-semibold">Other Charges:</td>
      <td>₹ 0.00</td>
    </tr>
   
    <tr>
      <td colSpan="5" className="text-right pr-2 font-bold">Total:</td>
      <td className="font-bold">₹ {order.total.toFixed(2)}</td>
    </tr>
    
    <tr>
      <td colSpan="5" className="text-right pr-2 font-semibold">Total Discount:</td>
      <td>₹ {order.totalDiscount.toFixed(2)}</td>
    </tr>
     <tr>
      <td colSpan="5" className="text-right pr-2 font-semibold">Total Qty:</td>
      <td>{(order.totalQty)}</td>
    </tr>
  </tfoot>

      </table>

      {/* Totals
      <div className="text-right mb-4">
        <p>Before Tax: ₹ {order.total.toFixed(2)}</p>
        <p>Other Charges: ₹ 0.00</p>
        <p>Total qty: ₹ {(order.totalQty * 0.1).toFixed(2)}</p>
        <p className="font-bold">Total: ₹ {(order.total).toFixed(2)}</p>
        <p>Total Discount: ₹ 0.00</p>
        <p>Paid Payment: ₹ {(order.totalDiscount).toFixed(2)}</p>
        <p>Change Return: ₹ 0.00</p>
      </div> */}

      <p className="text-center text-xs mt-4 italic">
        This is footer text. You can set it from Site Settings.
      </p>

      <div className="flex justify-center mt-4">
        <QRCodeSVG value={`http://localhost:5000/api/orders/${order.id}`} size={80} />
      </div>
    </div>
  );
}

export default PrintableInvoice;
