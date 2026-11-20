const express = require('express');
const router = express.Router();
const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
} = require('../controllers/serviceController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Anyone logged in can view
router.get('/',  getServices);
router.get('/:id',  getServiceById);

// Only staff/admin can create, update, delete
router.post('/', protect, authorizeRoles('staff', 'admin'), createService);
router.put('/:id', protect, authorizeRoles('staff', 'admin'), updateService);
router.delete('/:id', protect, authorizeRoles('admin'), deleteService);
module.exports = router;