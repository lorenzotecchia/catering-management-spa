import express from "express";
import morgan from "morgan";
import cors from "cors";

import { eventRouter } from "./routes/eventRouter.js";
import { authenticationRouter } from "./routes/authenticationRouter.js";
import { enforceAuthentication } from "./middleware/authorization.js";

const app = express();
const PORT = 3000;

// Register the morgan logging middleware, use the 'dev' format
app.use(morgan('dev'));

app.use(cors({
	origin: ['https://catering-management-app.vercel.app', 'http://localhost:4200'],
	credentials: true
}));

// Parse incoming requests with a JSON payload
app.use(express.json());

//define routes
app.use(authenticationRouter);
app.use(enforceAuthentication);
app.use(eventRouter);


//error handler
app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(err.status || 500).json({
		code: err.status || 500,
		description: err.message || "An error occurred"
	});
});

app.listen(PORT);
