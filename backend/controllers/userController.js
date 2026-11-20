const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route GET /api/users
// Admin only: view all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route POST /api/users
// Admin only: create a Staff or Admin account
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!['staff', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'This endpoint can only create staff or admin accounts' });
        }

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
            role,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route PUT /api/users/:id
// Admin only: update a user's role or details
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, role } = req.body;
        if (name) user.name = name;
        if (role) user.role = role;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route DELETE /api/users/:id
// Admin only: remove a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }

        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };