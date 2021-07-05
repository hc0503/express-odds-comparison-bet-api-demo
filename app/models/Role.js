const { DataTypes } = require('sequelize');
const database = require('#services/db.service');

const Role = database.define(
	'Role',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true,
			unique: true
		},
	},
	{
		// Enable automatic 'createdAt' and 'updatedAt' fields.
		timestamps: true,
	}
);

// Static methods:
Role.associate = (models) => {
	models.Role.hasMany(models.User, {
		foreignKey: "roleId",
		as: "users",
		constraints: false
	});
}
Role.findByName = function (name) {
	const query = {
		where: {
			name
		}
	};
	return this.findOne(query);
}
// Static methods\

module.exports = Role;
