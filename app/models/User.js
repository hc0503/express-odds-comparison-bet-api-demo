// ORM:
const { DataTypes } = require('sequelize');
const database = require('#services/db.service');

const bcryptSevice = require('#services/bcrypt.service');

const User = database.define(
	'User',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		email: {
			type: DataTypes.STRING(255),
			unique: true,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		photo: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	},
	{
		// Enable automatic 'createdAt' and 'updatedAt' fields.
		timestamps: true,
		// Only allow 'soft delete'
		// (set of 'deletedAt' field, insted of the real deletion).
		paranoid: true
	}
);

// Hooks:
User.beforeValidate((user, options) => {
	// Hash user's password.
	if (user.password)
		user.password = bcryptSevice.hashPassword(user);
})
// Hooks\

// Static methods:
User.associate = (models) => {
	models.User.hasMany(models.DisabledRefreshToken, {
		foreignKey: "userId",
		as: 'disabledRefreshTokens',
		constraints: false
	});
}

User.findById = function (id) {
	return this.findByPk(id);
}

User.findOneByEmail = function (email) {
	const query = {
		where: {
			email
		},
	};
	return this.findOne(query);
}
// Static methods\

// Instance methods:
User.prototype.toJSON = function () {
	const values = { ...this.get() };
	delete values.password;
	values.photo = process.env.BASE_URL + '/' + values.photo;
	return values;
}
// Instance methods\

module.exports = User;
