const User = require('#models/User');

module.exports = {
	run: _run
}

async function _run() {
	try {
		const user = await User.create({
			name: "Madeline T Heagney",
			phone: "(03) 5348 5891",
			address: "98 Garden Place, FENTONS CREEK, Victoria-3518",
			email: "admin@admin.com",
			password: "password",
		});
	}
	catch (error) {
		return Promise.reject(error);
	}
}
