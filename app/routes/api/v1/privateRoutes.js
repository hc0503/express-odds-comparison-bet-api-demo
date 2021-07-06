module.exports = {
	'GET /users/name': 'UserController.getFullName',

	// Profile:
	'GET /profiles/me': 'ProfileController.getMe',
	'POST /profiles/me/update-photo': 'ProfileController.updatePhoto',
	'POST /profiles/me/update-data': 'ProfileController.updateData',
	'POST /profiles/me/update-password': 'ProfileController.updatePassword',
};
