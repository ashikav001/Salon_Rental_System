const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAppointments,
    getMyAppointments,
    updateAppointment,
    deleteBooking,
} = require('../controllers/appointmentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, createAppointment);
router.get('/', protect, authorizeRoles('staff', 'admin'), getAppointments);
router.get('/my', protect, getMyAppointments);
router.put('/:id', protect, authorizeRoles('staff', 'admin'), updateAppointment);
router.delete(
    '/:id',
    protect,
    authorizeRoles('admin'),
    deleteBooking
);
module.exports = router;