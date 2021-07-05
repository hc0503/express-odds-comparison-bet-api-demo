// Import config from .env file.
require('dotenv').config();
const User = require('#models/User');
const Role = require('#models/Role');

// Data to seed:
const roles = require('./seeds/roles');
const users = require('./seeds/users');
// Import your seeders here...

// Connection to database.
const db = require('#services/db.service');


async function _main() {
	try {
		if (process.env.NODE_ENV !== 'development') {
			const error = new Error("Can not make any actions in non-dev env.");
			throw error;
		};

		// Make database connection active.
		const DB = await db.service(process.env.NODE_ENV).start();

		// Truncate
		// await User.destroy({ truncate: true, cascade: false });
		// await Role.destroy({ truncate: true, cascade: false });

		await roles.run();
		await users.run();
		// Run seeders here...

		console.warn("All seeds inserted");
		process.exit(0);
	}
	catch (error) {
		console.error('Seeder error:', error);
		process.exit(1);
	}
}

// Start.
_main();
