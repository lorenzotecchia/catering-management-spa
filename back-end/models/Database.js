// models/Database.js
import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createEventModel } from "./Event.js";
import { createModel as createNotificationModel } from "./Notification.js";
import 'dotenv/config.js';

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
	dialect: process.env.DIALECT,
	logging: console.log // Enable logging to see SQL queries
});

// Create models
const User = createUserModel(database);
const Event = createEventModel(database);
const Notification = createNotificationModel(database);

// Set up associations
User.hasMany(Event);
Event.belongsTo(User);

// Many-to-many relationship between Event and User (for waiters)
Event.belongsToMany(User, {
	through: 'EventWaiters',
	as: 'Waiters',
	foreignKey: 'eventId',
	otherKey: 'userName'
});

User.belongsToMany(Event, {
	through: 'EventWaiters',
	as: 'AssignedEvents',
	foreignKey: 'userName',
	otherKey: 'eventId'
});

// Notification associations
User.hasMany(Notification, {
	foreignKey: 'UserUserName',
	as: 'Notifications'
});
Notification.belongsTo(User, {
	foreignKey: 'UserUserName'
});
Event.hasMany(Notification, {
	foreignKey: 'EventId',
	as: 'Notifications'
});
Notification.belongsTo(Event, {
	foreignKey: 'EventId'
});

// Export models
export { User, Event, Notification };

// Sync database with more careful error handling
database.sync({ alter: true })
	.then(() => {
		console.log("Database synced successfully");
	})
	.catch(err => {
		console.error("Detailed sync error:", err);
		if (err.name === 'SequelizeValidationError') {
			err.errors.forEach(error => {
				console.error('Validation error:', error.message);
			});
		}
	});
