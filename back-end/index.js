import express from "express";
import morgan from "morgan"; //popular logging middleware (http://expressjs.com/en/resources/middleware/morgan.html)
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { eventRouter } from "./routes/eventRouter.js";
import { notificationRouter } from "./routes/notificationRouter.js"
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


//generate OpenAPI spec and show swagger ui
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc({
	definition: {
		openapi: '3.1.0',
		info: {
			title: 'Catering Management SPA',
			version: '1.0.0',
		},
	},
	apis: ['./routes/*Router.js'], // files containing annotations
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//define routes
app.use(authenticationRouter);
app.use(enforceAuthentication);
app.use(eventRouter);
app.use(notificationRouter);


//error handler
app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(err.status || 500).json({
		code: err.status || 500,
		description: err.message || "An error occurred"
	});
});

app.listen(PORT);
