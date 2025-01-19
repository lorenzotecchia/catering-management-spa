// EventController.js
import { Event, User } from "../models/Database.js"

export class EventController {
	static async getEventByUserName(req) {
		try {
			if (!req.username) {
				throw new Error('Username is required');
			}

			// Find user and their role
			const user = await User.findByPk(req.username);
			if (!user) {
				throw new Error('User not found');
			}

			let events;
			if (user.role === 'maitre') {
				// Maitre sees events they created
				events = await Event.findAll({
					where: {
						UserUserName: req.username
					},
					include: [{
						model: User,
						as: 'Waiters',
						attributes: ['userName', 'role']
					}],
					order: [['createdAt', 'DESC']]
				});
			} else {
				// Waiters see events they're assigned to
				events = await Event.findAll({
					include: [{
						model: User,
						as: 'Waiters',
						where: { userName: req.username },
						attributes: ['userName', 'role']
					}],
					order: [['createdAt', 'DESC']]
				});
			}

			return events;
		} catch (error) {
			console.error('Error fetching events:', error);
			throw new Error(`Error fetching events: ${error.message}`);
		}
	}

	static async saveEvent(req) {
		try {
			console.log('Received event data:', req.body);

			// Check required fields
			const { eventName, eventDate, Users } = req.body;
			if (!eventName || !eventDate) {
				throw new Error('Event name and date are required');
			}

			// Parse date
			const parsedDate = new Date(eventDate);
			if (isNaN(parsedDate.getTime())) {
				throw new Error('Invalid date format');
			}

			// Create the event
			const event = await Event.create({
				eventName,
				eventDate: parsedDate,
				eventLocation: req.body.eventLocation,
				numberOfParticipants: req.body.numberOfParticipants,
				eventDescription: req.body.eventDescription,
				UserUserName: req.username
			});

			// Handle waiter assignments if present
			if (Users && Array.isArray(Users)) {
				const waiterUsernames = Users.map(u => u.usr);
				const waiters = await User.findAll({
					where: {
						userName: waiterUsernames,
						role: 'waiter'
					}
				});

				// Associate waiters with the event
				await event.setWaiters(waiters);
			}

			// Fetch the created event with its associations
			const createdEvent = await Event.findByPk(event.id, {
				include: [{
					model: User,
					as: 'Waiters',
					attributes: ['userName', 'role']
				}]
			});

			return createdEvent;
		} catch (error) {
			console.error('Error saving event:', error);
			throw new Error(`Error saving event: ${error.message}`);
		}
	}

	// EventController.js
	// controllers/EventController.js
	static async updateEvent(req) {
		try {
			const { id } = req.params;
			console.log('Update request received:', {
				id,
				username: req.username,
				body: req.body
			});

			// Find the event
			const event = await Event.findByPk(id);

			if (!event) {
				throw new Error('Event not found');
			}

			// Update basic event information
			await event.update({
				eventName: req.body.eventName,
				eventDate: req.body.eventDate,
				eventLocation: req.body.eventLocation,
				numberOfParticipants: req.body.numberOfParticipants,
				eventDescription: req.body.eventDescription,
				UserUserName: req.username
			});

			// Handle waiter assignments
			if (req.body.Users && Array.isArray(req.body.Users)) {
				// Find all the user instances
				const waiterUsernames = req.body.Users.map(u => u.usr);
				const waiters = await User.findAll({
					where: {
						userName: waiterUsernames,
						role: 'waiter'
					}
				});

				// Update the association using the correct method
				await event.setWaiters(waiters);  // Note: using setWaiters instead of setUsers
			}

			// Fetch the updated event with its associations
			const updatedEvent = await Event.findByPk(id, {
				include: [{
					model: User,
					as: 'Waiters',  // Include the waiters association
					attributes: ['userName', 'role']
				}]
			});

			return updatedEvent;
		} catch (error) {
			console.error('Error in updateEvent:', error);
			throw error;
		}
	}

	static async delete(req) {
		try {
			const event = await Event.findByPk(req.params.id);

			if (!event) {
				throw new Error('Event not found');
			}

			if (event.UserUserName !== req.username) {
				throw new Error('Unauthorized to delete this event');
			}

			await event.destroy();
			return event;
		} catch (error) {
			throw new Error(`Error deleting event: ${error.message}`);
		}
	}

	static async findById(req) {
		try {
			const event = await Event.findByPk(req.params.id);

			if (!event) {
				throw new Error('Event not found');
			}

			return event;
		} catch (error) {
			throw new Error(`Error finding event: ${error.message}`);
		}
	}
}

