const alertService = require('../services/alertService');

exports.fetchAllNotifications = async (req, res) => {
    try {
        const notifications = await alertService.fetchAllNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error in controller fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

exports.fetchUnreadNotifications = async (req, res) => {
    try {
        const notifications = await alertService.fetchUnreadNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error in controller fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.body; // Extract the ID from the request body
        console.log('Notification ID from body:', id); // Debugging log

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Valid notification ID is required' });
        }

        await alertService.markAsRead(id);
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};