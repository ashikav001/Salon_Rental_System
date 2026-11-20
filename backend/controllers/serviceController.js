const Service = require('../models/Service');

// @route GET /api/service
// Anyone logged in can view all services
const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route GET /api/service/:id
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route POST /api/service
// Only staff/admin
const createService = async (req, res) => {
    try {
        const { name, description, category, pricePerDay, isAvailable } = req.body;

        const service = await Service.create({
            name,
            description,
            category,
            pricePerDay,
            isAvailable,
        });

        res.status(201).json(service);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route PUT /api/service/:id
// Only staff/admin
const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        Object.assign(service, req.body);
        const updatedService = await service.save();

        res.status(200).json(updatedService);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route DELETE /api/service/:id
// Only staff/admin
const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        await service.deleteOne();
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};