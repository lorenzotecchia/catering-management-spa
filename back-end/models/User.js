import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

export function createModel(database) {
	const User = database.define('User', {
		userName: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			validate: {
				notEmpty: true,
				len: [3, 50]
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			set(value) {
				const salt = bcrypt.genSaltSync(10);
				const hash = bcrypt.hashSync(value, salt);
				this.setDataValue('password', hash);
			}
		},
		role: {
			type: DataTypes.ENUM('maitre', 'waiter'),
			allowNull: false,
			defaultValue: 'waiter'
		}
	}, {
		modelName: 'User',
		tableName: 'Users'
	});

	User.prototype.verifyPassword = function(password) {
		return bcrypt.compareSync(password, this.password);
	};

	return User;  // Now User is properly defined and can be returned
}
