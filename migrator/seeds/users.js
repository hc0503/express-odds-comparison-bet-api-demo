const User = require('#models/User');
const Role = require('#models/Role');
const Company = require('#models/Company');

module.exports = {
	run: _run
}

async function _run() {
	try {
		const role = await Role.findByName('Client (Homeowner)');

		const user = await User.create({
			roleId: role.id,
			name: "Madeline T Heagney",
			phone: "(03) 5348 5891",
			address: "98 Garden Place, FENTONS CREEK, Victoria-3518",
			email: "admin@admin.com",
			password: "password",
			company: {
				businessName: "Interlor Archltect",
				phoneNumber: "(03) 5348 5891",
				address: "98 Garden Place, FENTONS CREEK, Victoria-3518",
				licenseNumber: "5348 5891",
				yearFounded: "2012",
				abnNumber: "5348 5891",
				services: [
					{name: "Bathroom"},
					{name: "Kitchen"},
				]
			}
		}, {
			include: {
				model: Company,
				as: 'company'
			}
		});
	}
	catch (error) {
		return Promise.reject(error);
	}
}
