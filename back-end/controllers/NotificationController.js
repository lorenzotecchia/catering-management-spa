import { Notification } from "../models/Database.js";

export class NotificationController {

	static async updateNotifications(id, updated) {
		try {
			const notification = await Notification.findByPk(id);

			if (!notification) {
				throw new Error('Notification not found');
			}

			notification.set(updated);
			return await notification.save();
		} catch (error) {
			throw new Error(`Error updating notification: ${error.message}`);
		}
	}

	static async delete(req) {
		try {
			const notification = await Notification.findByPk(req.params.id);

			if (!notification) {
				throw new Error('Notification not found');
			}

			if (notification.UserUserName !== req.username) {
				throw new Error('Unauthorized to delete this notification');
			}

			await notification.destroy();
			return notification;
		} catch (error) {
			throw new Error(`Error deleting notification: ${error.message}`);
		}
	}

	static async findById(req) {
		try {
			const notification = await Notification.findByPk(req.params.id);

			if (!notification) {
				throw new Error('Notification not found');
			}

			return notification;
		} catch (error) {
			throw new Error(`Error finding notification: ${error.message}`);
		}
	}

	static async saveNotification(req) {
		try {
			console.log('Creating notification:', req.body);

			const notification = await Notification.create({
				NotificationContent: req.body.NotificationContent,
				UserUserName: req.body.UserUserName,
				Event: req.body.Event,
				read: false
			});

			console.log('Created notification:', notification);
			return notification;
		} catch (error) {
			console.error('Error saving notification:', error);
			throw error;
		}
	}

	static async getNotificationByUserName(req) {
		try {
			console.log('Getting notifications for user:', req.username);

			const notifications = await Notification.findAll({
				where: {
					UserUserName: req.username
				},
				order: [['createdAt', 'DESC']]
			});

			console.log('Found notifications:', notifications);
			return notifications;
		} catch (error) {
			console.error('Error fetching notifications:', error);
			throw error;
		}
	}

	static async readNotification(req) {
		try {
			const notification = await Notification.findByPk(req.params.id);

			if (!notification) {
				throw new Error('Notification not found');
			}

			if (notification.UserUserName !== req.username) {
				throw new Error('Unauthorized to mark this notification as read');
			}

			await notification.update({ read: true });
			return notification;
		} catch (error) {
			throw new Error(`Error marking notification as read: ${error.message}`);
		}
	}

	// Additional useful methods
	static async getUnreadCount(req) {
		try {
			return await Notification.count({
				where: {
					UserUserName: req.username,
					read: false
				}
			});
		} catch (error) {
			throw new Error(`Error getting unread count: ${error.message}`);
		}
	}

	static async markAllAsRead(req) {
		try {
			const result = await Notification.update(
				{ read: true },
				{
					where: {
						UserUserName: req.username,
						read: false
					}
				}
			);
			return result;
		} catch (error) {
			throw new Error(`Error marking all notifications as read: ${error.message}`);
		}
	}
}
