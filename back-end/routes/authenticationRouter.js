import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { User } from "../models/Database.js";

export const authenticationRouter = express.Router();

/**
 * @swagger
 *  /auth:
 *    post:
 *      description: Authenticate user
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: user credentials to authenticate
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                usr:
 *                  type: string
 *                  example: Kyle
 *                pwd:
 *                  type: string
 *                  example: p4ssw0rd
 *      responses:
 *        200:
 *          description: User authenticated
 *        401:
 *          description: Invalid credentials
 */
//authenticationRouter.post("/auth", async (req, res) => {
//	let user = await AuthController.checkCredentials(req, res);
//	if (user) {
//		res.json({
//			token: AuthController.issueToken(user.userName),
//			role: user.role,
//		})
//	} else {
//		res.status(401);
//		res.json({ error: "Invalid credentials. Try again." });
//	}
//});
// authenticationRouter.js
authenticationRouter.post("/auth", async (req, res) => {
	console.log('Auth route hit with request:', req.body);
	let user = await AuthController.checkCredentials(req, res);
	console.log('User after checkCredentials:', user);

	if (user) {
		const token = await AuthController.issueToken(user.userName);
		console.log('Generated token:', token);
		console.log('User role:', user.role);

		res.json({
			token: token,
			role: user.role,
		});
	} else {
		res.status(401).json({ error: "Invalid credentials. Try again." });
	}
});

authenticationRouter.post("/signup", (req, res, next) => {
	console.log('Signup request received:', req.body); // Add this

	AuthController.saveUser(req, res)
		.then((user) => {
			console.log('User created successfully:', user); // Add this
			res.json(user);
		})
		.catch((err) => {
			console.error('Signup error details:', err); // Add this
			next({ status: 500, message: "Could not save user", error: err.message });
		});
});

authenticationRouter.get("/users/waiters", async (req, res, next) => {
	try {
		const waiters = await User.findAll({
			where: { role: 'waiter' },
			attributes: ['userName', 'role'],
			raw: true
		});

		const formattedWaiters = waiters.map(waiter => ({
			usr: waiter.userName,
			role: waiter.role,
			pwd: ''
		}));

		res.json(formattedWaiters);
	} catch (error) {
		console.error('Error fetching waiters:', error);
		next({ status: 500, message: "Could not fetch waiters", error: error.message });
	}
});
