const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/notifications', alertController.fetchAllNotifications);
router.get('/notifications/unread', alertController.fetchUnreadNotifications);
router.post('/notifications/mark-read', alertController.markAsRead);

module.exports = router;