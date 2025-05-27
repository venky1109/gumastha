import { useState } from 'react';

function CustomerLookup({ token, onCustomerFound }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [customer, setCustomer] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/customers/phone/${phone}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (res.ok) {
        setCustomer(data);
        setName(data.name);
        setEmail(data.email || '');
        setAddress(data.address || '');
        setNotFound(false);
        setError('');
        onCustomerFound?.(data);
      } else {
        setCustomer(null);
        setName('');
        setEmail('');
        setAddress('');
        setNotFound(true);
        setError('Customer not found. You can add new.');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const createCustomer = async () => {
    const defaultAddress = address  || 'Walk-in';

    try {
      const res = await fetch(`http://localhost:5000/api/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name || 'Walk-in',
          phone,
          email,
          address: defaultAddress
        })
      });

      const data = await res.json();

      if (res.ok) {
        setCustomer(data);
        setNotFound(false);
        setError('');
        onCustomerFound?.(data);
      } else {
        setError(data.error || 'Failed to add customer');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handlePhoneBlur = async () => {
    if (phone.trim().length >= 10) {
      await fetchCustomer();
    }
  };

  const handleSaveIfNotFound = async () => {
    if (notFound && phone) {
      await createCustomer();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">👤 </span>

        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={handlePhoneBlur}
          placeholder="Mobile Number"
          className="px-2 py-1 border border-gray-300 rounded text-sm w-1/4"
          required
        />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Customer Name (optional)"
          className="px-2 py-1 border border-gray-200 bg-gray-50 rounded text-sm w-1/4"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional)"
          className="px-2 py-1 border border-gray-200 bg-gray-50 rounded text-sm w-1/4"
        />

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address (optional)"
          className="px-2 py-1 border border-gray-200 bg-gray-50 rounded text-sm w-1/4"
        />
      </div>

      {notFound && (
        <button
          onClick={handleSaveIfNotFound}
          className="text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
        >
          ➕ Add New Customer
        </button>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}

      {/* Product search input
      <input
        type="text"
        placeholder="Item name / Barcode / Code"
        className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      /> */}
    </div>
  );
}

export default CustomerLookup;
