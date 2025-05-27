const Order = require('../models/order');

exports.getAll = (req, res) => {
  Order.findAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getOne = (req, res) => {
  Order.findById(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Order not found" });
    res.json(row);
  });
};

exports.create = (req, res) => {
  Order.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(result);
  });
};

exports.delete = (req, res) => {
  Order.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order deleted" });
  });
};
