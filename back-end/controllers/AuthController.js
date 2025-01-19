import { User, Event } from "../models/Database.js";
import Jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'


export class AuthController {
	static async checkCredentials(req, res) {
		console.log('Checking credentials for:', req.body.usr);

		try {
			// First, find the user by username
			const user = await User.findOne({
				where: {
					userName: req.body.usr
				},
				attributes: ['userName', 'password', 'role']
			});

			if (!user) {
				console.log('User not found');
				return null;
			}

			// Compare the provided password with the stored hash
			const isPasswordValid = await bcrypt.compare(req.body.pwd, user.password);

			if (isPasswordValid) {
				// Return user without password
				return {
					userName: user.userName,
					role: user.role
				};
			} else {
				console.log('Invalid password');
				return null;
			}
		} catch (error) {
			console.error('Error in checkCredentials:', error);
			return null;
		}
	}

	static async issueToken(username) {
		console.log('Issuing token for username:', username);
		const user = await User.findOne({
			where: { userName: username }
		});
		console.log('User for token:', user);

		return Jwt.sign(
			{
				user: username,
				role: user.role
			},
			process.env.TOKEN_SECRET,
			{ expiresIn: `${24 * 60 * 60}s` }
		);
	}

	static async saveUser(req, res) {
		let user = new User({
			userName: req.body.usr,
			password: req.body.pwd,
			role: req.body.role || 'waiter' // Default to 'waiter' if not specified
		});
		return user.save();
	}

	static isTokenValid(token, callback) {
		console.log("Validating token:", token)

		Jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
			console.log('Token verification result:', { err, decoded }); // Debug log
			callback(err, decoded);
		});
	}

	static async canUserModifyEvent(username, eventId) {
		const event = await Event.findByPk(eventId);
		const user = await User.findByPk(username)
		//todo must exist and be associated with user
		return event && event.UserUserName === user && user.role === 'maitre'
	}
}
