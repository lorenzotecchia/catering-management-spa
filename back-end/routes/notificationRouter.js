import express from "express"
import { NotificationController } from "../controllers/NotificationController.js"
import { errorHandler } from "../middleware/errorHandler.js"
import { enforceAuthentication } from "../middleware/authorization.js"


export const notificationRouter = express.Router()

// Get notifications for a user
notificationRouter.get("/notification", (req, res, next) => {
	NotificationController.getNotificationByUserName(req)
		.then(notifications => {
			res.status(200).json({
				success: true,
				data: notifications
			})
		})
		.catch(err => {
			next(err)
		})
})

notificationRouter.get("/notification/unread/count", async (req, res, next) => {
	try {
		const count = await NotificationController.getUnreadCount(req);
		res.json(count);
	} catch (error) {
		next(error);
	}
});

// Create a new notification
notificationRouter.post("/notification", (req, res, next) => {
	NotificationController.saveNotification(req)
		.then(notification => {
			res.status(201).json({
				success: true,
				data: notification
			})
		})
		.catch(err => {
			next(err)
		})
})

// Delete a notification
notificationRouter.delete("/notification/:id", (req, res, next) => {
	NotificationController.delete(req)
		.then(notification => {
			res.status(200).json({
				success: true,
				message: 'Notification deleted successfully',
				data: notification
			})
		})
		.catch(err => {
			next(err)
		})
})

// Mark notification as read
notificationRouter.patch("/notification/:id/read", (req, res, next) => {
	NotificationController.readNotification(req)
		.then(notification => {
			res.status(200).json({
				success: true,
				message: 'Notification marked as read',
				data: notification
			})
		})
		.catch(err => {
			next(err)
		})
})


notificationRouter.use(enforceAuthentication)
notificationRouter.use(errorHandler);
