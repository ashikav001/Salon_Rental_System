const Notification = require('../models/Notification');

// @route GET /api/notification
// Logged-in user: view their own notifications
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route PUT /api/notification/:id
// Mark a notification as read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        const updated = await notification.save();

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getMyNotifications, markAsRead };