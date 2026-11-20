const Customer = require('../models/Customer');

// @route GET /api/customer
// Staff/Admin: view all customers
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate('user', 'name email role');
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route GET /api/customer/:id
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).populate('user', 'name email role');
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route POST /api/customer
// Creates a customer profile linked to the logged-in user
const createCustomer = async (req, res) => {
    try {
        const { phone, address } = req.body;

        const existing = await Customer.findOne({ user: req.user._id });
        if (existing) {
            return res.status(400).json({ message: 'Customer profile already exists' });
        }

        const customer = await Customer.create({
            user: req.user._id,
            phone,
            address,
        });

        res.status(201).json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route PUT /api/customer/:id
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        Object.assign(customer, req.body);
        const updatedCustomer = await customer.save();

        res.status(200).json(updatedCustomer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route DELETE /api/customer/:id
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await customer.deleteOne();
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};