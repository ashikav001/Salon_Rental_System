const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
// Generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @route POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'customer',
        });
        // Auto-create a Customer profile if this user registered as a customer
        if (user.role === 'customer') {
            await Customer.create({ user: user._id });
        }

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route POST /api/auth/login
// @route POST /api/auth/login
// @route POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ _id: user._id, token, role: user.role, name: user.name });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = { registerUser, loginUser };