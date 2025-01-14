import { database } from "../models/Database.js";

export class ResetController {

	static async resetApp(req, res) {
		req.session.username = undefined;
		req.session.isAuthenticated = false;
		return database.sync({ force: true });
	}
}
