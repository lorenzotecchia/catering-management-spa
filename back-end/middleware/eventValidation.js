// middleware/eventValidation.js
export const validateEventForm = (req, res, next) => {
	const { title, date } = req.body;
	const errors = [];

	if (!title?.trim()) {
		errors.push('Title is required');
	}

	if (!date) {
		errors.push('Date is required');
	} else {
		const parsedDate = new Date(date);
		if (isNaN(parsedDate.getTime())) {
			errors.push('Invalid date format');
		}
	}

	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			errors: errors
		});
	}

	next();
};
