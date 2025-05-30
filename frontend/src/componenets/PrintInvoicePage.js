import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrintableInvoice from './PrintableInvoice';

function PrintInvoicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/pos'); // fallback if no order
      return;
    }

    // Auto print
    setTimeout(() => {
      window.print();
    }, 300);
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="p-6">
      <PrintableInvoice order={order} />
    </div>
  );
}

export default PrintInvoicePage;
