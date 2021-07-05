const Role = require('#models/Role');

// Reponse protocols.
const {
	createOKResponse,
	createErrorResponse
} = require('#factories/responses/api');
// Custom error.
const { Err } = require('#factories/errors');


module.exports = RoleController;

function RoleController() {

	const _processError = (error, req, res) => {
		// Default error message.
		let errorMessage = error?.message ?? 'Internal server error';
		// Default HTTP status code.
		let statusCode = 500;

		switch (error.name) {
			case ('Unauthorized'):
				errorMessage = 'Email or password are incorrect.';
				statusCode = 406;
				break;
			case ('ValidationError'):
				errorMessage = "Invalid email OR password input";
				statusCode = 402;
				break;
			case ('InvalidToken'):
				errorMessage = 'Invalid token or token expired';
				statusCode = 401;
				break;
			case ('UserNotFound'):
				errorMessage = "Such user doesn't exist";
				statusCode = 400;
				break;

			// Perform your custom processing here...

			default:
				break;
		}

		// Send error response with provided status code.
		return createErrorResponse({
			res,
			error: {
				message: errorMessage
			},
			status: statusCode
		});
	}

	// Protected:
	const _getRoles = async (req, res) => {
		try {
			const roles = await Role.findAll();

			return createOKResponse({
				res,
				data: {
					roles
				}
			});
		}
		catch (error) {
			console.error("RolesController.getRoles error: ", error);
			return _processError(error, req, res);
		}
	}

	return {
		getRoles: _getRoles,
	}
}