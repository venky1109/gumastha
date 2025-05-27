const CustomerOrder = require('../models/customerOrder');

exports.create = (req, res) => {
  CustomerOrder.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(result);
  });
};

exports.getByCustomer = (req, res) => {
  CustomerOrder.findByCustomerId(req.params.customer_id, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.delete = (req, res) => {
  CustomerOrder.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Customer order deleted" });
  });
};
