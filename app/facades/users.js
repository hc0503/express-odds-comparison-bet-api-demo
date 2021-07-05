const User = require('#models/User');
const Company = require('#models/Company');
const JWT = require('#facades/jwt.facade');
const bcrypt = require('#services/bcrypt.service');
const { Err } = require('#factories/errors');

module.exports = {
	register: _register,
	login: _login,
	// Private:
	getFullName: _getFullName,
	// Private\
}

async function _register({ roleId, name, email, password }) {
	try {
		// Try to create new user.
		const user = await User.create({
			roleId,
			name,
			email,
			password,
			company: {
				logoImage: ""
			}
		}, {
			include: {
				model: Company,
				as: 'company'
			}
		});

		// Issue new access and refresh JWT.
		const [tokens] = await JWT.issueTokens({ user });

		// Prepare output.
		const result = [
			tokens,
			user
		];
		// Send output.
		return Promise.resolve(result);
	}
	catch (error) {
		return Promise.reject(error);
	}
}

async function _login({ email, password }) {
	try {
		// Try to find user.
		const user = await User.findOneByEmail(email);

		if (!user) {
			// If no such user was found, throw error with name UserNotFound:
			const err = new Err('User not found');
			err.name = "UserNotFound";
			throw err;
		}

		if (!bcrypt.comparePasswords(password, user.password)) {
			// Validation failed,
			// throw custom error with name Unauthorized:
			const err = new Err(`Validation failed.`);
			err.name = "ValidationError";
			throw err;
		}

		// Issue new access and refresh JWT.
		const [tokens] = await JWT.issueTokens({ user });

		// Prepare output.
		const result = [
			tokens,
			user
		];
		// Send output.
		return Promise.resolve(result);
	}
	catch (error) {
		return Promise.reject(error);
	}
}

// Private:
async function _getFullName({ userId }) {
	try {
		// Try to find user.
		const user = await User.findById(userId);

		if (!user) {
			// If no such user was found, throw error with name UserNotFound:
			const err = new Err('User not found');
			err.name = "UserNotFound";
			throw err;
		}

		// Get value of virtual field 'fullName'.
		const fullName = user.fullName;

		// Send output.
		return Promise.resolve([fullName]);
	}
	catch (error) {
		return Promise.reject(error);
	}
}
// Private\
