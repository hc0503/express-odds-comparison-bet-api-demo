const Role = require('#models/Role');

module.exports = {
	run: _run
}

async function _run() {
	try {
		const seedData = [
			{ name: "Client (Homeowner)" },
			{ name: "Ace (Contractor)" },
			{ name: "Ace (Planner)" },
			{ name: "Ace (Supplier)" },
		]

		const roles = await Role.bulkCreate(seedData);
	}
	catch (error) {
		return Promise.reject(error);
	}
}
