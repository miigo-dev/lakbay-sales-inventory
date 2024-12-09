const db = require('../db'); 

exports.fetchAllNotifications = async () => {
    try {
        const result = await db.query('SELECT * FROM notifications ORDER BY created_at DESC');
        return result.rows; // Return rows only
    } catch (error) {
        console.error('Error in service fetching notifications:', error);
        throw error; // Propagate the error to the controller
    }
};

exports.fetchUnreadNotifications = async () => {
    try {
        const result = await db.query('SELECT * FROM notifications WHERE is_read = FALSE');
        return result.rows; // Return rows only
    } catch (error) {
        console.error('Error in service fetching notifications:', error);
        throw error; // Propagate the error to the controller
    }
};

exports.markAsRead = async (id) => {
    try {
        console.log('Marking notification as read, ID:', id); // Debugging log

        const result = await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE notification_id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            throw new Error('Notification not found');
        }
    } catch (error) {
        console.error('Error in service marking notification as read:', error);
        throw error;
    }
};