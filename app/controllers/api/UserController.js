// Facades:
const usersFacade = require('#facades/users');
const jwtFacade = require('#facades/jwt.facade');
const validator = require('validatorjs');
// JWT Service.
const JWT = require('#services/jwt.service');
// Reponse protocols.
const {
	createOKResponse,
	createErrorResponse
} = require('#factories/responses/api');
// Custom error.
const { Err } = require('#factories/errors');


module.exports = UserController;

function UserController() {

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
			status: statusCode,
			msg: errorMessage
		});
	}

	// Auth:
	const _register = async (req, res) => {
		try {
			const { name, email, password } = req.body;
			const rules = {
				name: ['required'],
				email: ['required', 'email'],
				password: ['required', 'min:8', 'confirmed'],
				password_confirmation: ['required']
			}
			const validation = new validator(req.body, rules);
			if (validation.fails()) {
				return createErrorResponse({
					res,
					status: 412,
					errors: validation.errors.errors
				});
			}
			// Create new one.
			const [tokens, user] = await usersFacade.register({
				name,
				email,
				password,
			});

			// Everything's fine, send response.
			return createOKResponse({
				res,
				data: {
					tokens,
					// Convert user to JSON, to clear sensitive data (like password)
					user: user.toJSON()
				}
			});
		}
		catch (error) {
			console.error("UsersController._create error: ", error);
			return _processError(error, req, res);
		}
	}

	const _login = async (req, res) => {
		try {
			// Extract request input:
			const email = req.body?.email
			const password = req.body?.password


			if (!email || email === undefined || !password || password === undefined) {
				// If bad input, throw ValidationError:
				const err = new Error("Invalid email OR password input");
				err.name = "ValidationError";
				throw err;
			}

			const [tokens, user] = await usersFacade.login({ email, password });

			// Everything's fine, send response.
			return createOKResponse({
				res,
				data: {
					tokens,
					// Convert user to JSON, to clear sensitive data (like password).
					user: user.toJSON()
				}
			});
		}
		catch (error) {
			console.error("UsersController._login error: ", error);
			return _processError(error, req, res);
		}
	}

	const _validate = async (req, res) => {
		try {
			const { token } = req.body;

			// Validate token against local seed.
			await JWT.verifyAccessToken(token);

			// Everything's fine, send response.
			return createOKResponse({
				res,
				data: {
					isValid: true,
					message: "Valid Token"
				}
			});
		}
		catch (error) {
			console.error("UsersController._validate error: ", error);

			// In any error case, we send token not valid:
			// Create custom error with name InvalidToken.
			const err = new Error('Invalid Token!');
			err.name = "InvalidToken";
			return _processError(err, req, res);
		}
	}

	const _refresh = async (req, res) => {
		try {
			// Unwrap refresh token.
			const refreshToken = req?.refreshToken;
			if (!refreshToken) {
				const err = new Err("No refreshToken found");
				err.name = "Unauthorized";
				err.status = 401;
				throw err;
			}

			// Everything's ok, issue new one.
			const [accessToken] = await jwtFacade.refreshAccessToken({ refreshToken });

			return createOKResponse({
				res,
				data: {
					token: accessToken
				}
			});
		}
		catch (error) {
			console.error("UsersController._refresh error: ", error);

			// In any error case, we send token not valid:
			// Create custom error with name InvalidToken.
			const err = new Error('Invalid Token!');
			err.name = "InvalidToken";
			return _processError(err, req, res);
		}
	}

	const _logout = async (req, res) => {
		try {
			const refreshToken = req?.refreshToken;
			if (!refreshToken) {
				const err = new Err("No refreshToken found");
				err.name = "Unauthorized";
				err.status = 401;
				throw err;
			}

			// Everything's ok, destroy token.
			const [status] = await jwtFacade.disableRefreshToken({ refreshToken });

			return createOKResponse({
				res,
				data: {
					status,
					loggedIn: status === true
				}
			});
		}
		catch (error) {
			console.error("UsersController._logout error: ", error);

			// In any error case, we send token not valid:
			// Create custom error with name InvalidToken.
			const err = new Error('Invalid Token!');
			err.name = "InvalidToken";
			return _processError(err, req, res);
		}
	}
	// Auth\

	// Protected:
	const _getFullName = async (req, res) => {
		try {
			// Unwrap user's id.
			const userId = req?.token?.id;

			// Try to get full name.
			const [fullName] = await usersFacade.getFullName({ userId });

			console.log({ fullName });

			return createOKResponse({
				res,
				data: {
					fullName
				}
			});
		}
		catch (error) {
			console.error("UsersController._getFullName error: ", error);
			return _processError(error, req, res);
		}
	}

	return {
		// Auth:
		register: _register,
		login: _login,
		validate: _validate,
		refresh: _refresh,
		logout: _logout,

		// Protected:
		getFullName: _getFullName
	}
}