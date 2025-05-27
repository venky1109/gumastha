const OrderItem = require('../models/orderItem');

// exports.create = (req, res) => {
//   OrderItem.create(req.body, (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.status(201).json(result);
//   });
// };
exports.create = (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];
  let created = 0;

  items.forEach((item, index) => {
    OrderItem.create(item, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      created++;
      if (created === items.length) {
        res.status(201).json({ message: `${created} order items added.` });
      }
    });
  });
};


exports.getByOrder = (req, res) => {
  OrderItem.findByOrderId(req.params.order_id, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.delete = (req, res) => {
  OrderItem.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order item deleted" });
  });
};
