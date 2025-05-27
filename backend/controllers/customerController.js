const Customer = require('../models/customerModel');

const createCustomer = (req, res) => {
  const { name, phone, email, address } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  Customer.addCustomer({ name, phone, email, address }, (err, customer) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(customer);
  });
};

const getCustomerByPhone = (req, res) => {
  const { phone } = req.params;
  Customer.getCustomerByPhone(phone, (err, customer) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  });
};

const getAllCustomers = (req, res) => {
  Customer.getAllCustomers((err, customers) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(customers);
  });
};

module.exports = {
  createCustomer,
  getCustomerByPhone,
  getAllCustomers
};
