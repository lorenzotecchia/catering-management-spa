import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createEventModel } from "./Event.js";
import 'dotenv/config.js';

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
	dialect: process.env.DIALECT,
	logging: console.log // Enable logging to see SQL queries
});

// Create models
const User = createUserModel(database);
const Event = createEventModel(database);

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


// Export models
export { User, Event }

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
