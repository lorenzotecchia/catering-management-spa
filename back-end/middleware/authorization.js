import { AuthController } from "../controllers/AuthController.js";

/**
 * This middleware ensures that the user is currently authenticated. If not,
 * redirects to login with an error message.
 */
export function enforceAuthentication(req, res, next) {
	const authHeader = req.headers['authorization']
	console.log('Auth header:', authHeader)
	const token = authHeader?.split(' ')[1];
	if (!token) {
		console.log("No token found")
		next({ status: 401, message: "Unauthorized" });
		return;
	}

	AuthController.isTokenValid(token, (err, decodedToken) => {
		if (err) {
			console.log("Token validation error:", err)
			next({ status: 401, message: "Unauthorized" });
		} else {
			console.log("Decoded token:", decodedToken)
			req.username = decodedToken.user;
			next();
		}
	});
}

export async function ensureUsersModifyOnlyOwnEvent(req, res, next) {
	const username = req.username;
	const eventId = req.params.id;
	const userHasPermission = await AuthController.canUserModifyEvent(username, eventId);
	if (userHasPermission) {
		next();
	} else {
		next({
			status: 403,
			message: "Forbidden! You do not have permissions to view or modify this resource"
		});
	}
}
