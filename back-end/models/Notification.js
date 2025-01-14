// models/Notification.js
import { DataTypes } from "sequelize";

export function createModel(database) {
	const Notification = database.define('Notification', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		NotificationContent: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		read: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		EventId: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		UserUserName: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});

	return Notification;
}
