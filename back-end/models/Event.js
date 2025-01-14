import { DataTypes } from "sequelize";

export function createModel(database) {
	const Event = database.define('Event', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true

		},
		eventName: {
			type: DataTypes.TEXT
		},
		eventDate: {
			type: DataTypes.DATE
		},
		eventLocation: {
			type: DataTypes.TEXT
		},
		eventTimeOfDay: {
			type: DataTypes.TEXT
		},
		numberOfParticipants: {
			type: DataTypes.INTEGER,
		},
		eventDescription: {
			type: DataTypes.TEXT
		},
		eventWaiters: {
			type: DataTypes.TEXT
		}
	})
	return Event
}
