const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        category: {
            type: String,
        },
        pricePerDay: {
            type: Number,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        image: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);