const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Customer = require('../models/Customer');
const Notification = require('../models/Notification');

// Helper: calculate number of days between two dates (inclusive)
const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1; // minimum 1 day
};

// @route POST /api/booking
// Customer books a service for a date range
const createAppointment = async (req, res) => {
    try {
        const { serviceId, startDate, endDate } = req.body;

        // Find the customer profile linked to the logged-in user
        const customer = await Customer.findOne({ user: req.user._id });
        if (!customer) {
            return res.status(400).json({ message: 'Customer profile not found. Create one first.' });
        }

        // Find the service being rented
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        if (!service.isAvailable) {
            return res.status(400).json({ message: 'This asset is currently not available' });
        }

        // ---- AUTOMATIC PRICE CALCULATION ----
        const numberOfDays = calculateDays(startDate, endDate);
        const totalPrice = numberOfDays * service.pricePerDay;
        // --------------------------------------

        const appointment = await Appointment.create({
            customer: customer._id,
            service: service._id,
            startDate,
            endDate,
            totalPrice,
            status: 'booked',
        });

        // Mark asset as unavailable once booked
        service.isAvailable = false;
        await service.save();
        await Notification.create({
            user: req.user._id,
            message: `Your booking for "${service.name}" is confirmed. Total price: ₹${totalPrice}.`,
        });

        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route GET /api/booking
// Staff/Admin: view all appointments
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('service', 'name pricePerDay')
            .populate({
                path: 'customer',
                populate: { path: 'user', select: 'name email' },
            });
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route GET /api/booking/my
// Customer: view their own appointments
const getMyAppointments = async (req, res) => {
    try {
        const customer = await Customer.findOne({ user: req.user._id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer profile not found' });
        }

        const appointments = await Appointment.find({ customer: customer._id }).populate(
            'service',
            'name pricePerDay'
        );

        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route PUT /api/booking/:id
// Update status (e.g., mark as returned) — Staff/Admin
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = req.body.status || appointment.status;
        const updated = await appointment.save();

        // If returned, make the asset available again
        if (updated.status === 'returned') {
            const service = await Service.findById(updated.service);
            if (service) {
                service.isAvailable = true;
                await service.save();
                await Notification.create({
                    user: req.user._id,
                    message: `Your rental for "${service.name}" has been marked as returned.`,
        });
            }
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const deleteBooking = async (req, res) => {
    try {
        const booking = await Appointment.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        if (booking.status !== 'returned') {
            return res.status(400).json({
                message: 'Only returned bookings can be deleted'
            });
        }

        await booking.deleteOne();

        res.json({
            message: 'Returned booking deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
module.exports = {
    createAppointment,
    getAppointments,
    getMyAppointments,
    updateAppointment,
    deleteBooking,
};