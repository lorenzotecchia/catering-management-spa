// eventRouter.js
import express from "express"
import { EventController } from "../controllers/EventController.js"
import { errorHandler } from "../middleware/errorHandler.js";

export const eventRouter = express.Router()

// Get all events for a user
eventRouter.get("/event", (req, res, next) => {
	EventController.getEventByUserName(req)
		.then(events => {
			res.status(200).json({
				success: true,
				data: events
			});
		})
		.catch(next);
});

// Create new event
eventRouter.post("/event", (req, res, next) => {
	EventController.saveEvent(req)
		.then(event => {
			res.status(201).json({
				success: true,
				data: event
			});
		})
		.catch(next);
});

// Update event
// eventRouter.js
eventRouter.put("/event/:id", async (req, res, next) => {
	try {
		const updatedEvent = await EventController.updateEvent(req);
		res.status(200).json({
			success: true,
			data: updatedEvent
		});
	} catch (error) {
		console.error('Router error:', error);
		next({
			status: 500,
			message: error.message || "Error updating event"
		});
	}
});

// Delete event
eventRouter.delete("/event/:id", (req, res, next) => {
	EventController.delete(req)
		.then(event => {
			res.status(200).json({
				success: true,
				message: 'Event deleted successfully',
				data: event
			});
		})
		.catch(next);
});

// Get single event
eventRouter.get("/event/:id", (req, res, next) => {
	EventController.findById(req)
		.then(event => {
			res.status(200).json({
				success: true,
				data: event
			});
		})
		.catch(next);
});

eventRouter.use(errorHandler);
