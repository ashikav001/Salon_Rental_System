const express = require('express');
const router = express.Router();
const {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} = require('../controllers/customerController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Staff/Admin only: view all customers
router.get('/', protect, authorizeRoles('staff', 'admin'), getCustomers);
router.get('/:id', protect, authorizeRoles('staff', 'admin'), getCustomerById);

// Any logged-in user can create their own customer profile
router.post('/', protect, createCustomer);

// Staff/Admin can update/delete
router.put('/:id', protect, authorizeRoles('staff', 'admin'), updateCustomer);
router.delete('/:id', protect, authorizeRoles('staff', 'admin'), deleteCustomer);

module.exports = router;