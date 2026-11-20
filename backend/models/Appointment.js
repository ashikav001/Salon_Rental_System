const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['booked', 'ongoing', 'returned', 'cancelled'],
            default: 'booked',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);