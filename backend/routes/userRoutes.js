const express = require('express');
const router = express.Router();
const { listUsers, updateUser, deleteUser } = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// All routes here require ADMIN
router.use(verifyToken, authorizeRoles('ADMIN'));

router.get('/', listUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
