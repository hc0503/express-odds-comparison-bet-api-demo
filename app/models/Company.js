// ORM:
const { DataTypes } = require('sequelize');
const database = require('#services/db.service');
const CompanyImage = require('#models/CompanyImage');

const Company = database.define(
	'Company',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		userId: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			required: true,
			allowNull: false
		},
		logoImage: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		heroImage: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		businessName: {
			type: DataTypes.STRING(191),
			allowNull: true
		},
		phoneNumber: {
			type: DataTypes.STRING(191),
			allowNull: true
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		licenseNumber: {
			type: DataTypes.STRING(191),
			allowNull: true
		},
		yearFounded: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		abnNumber: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		services: {
			type: DataTypes.JSON,
			allowNull: true
		}
	},
	{
		timestamps: true,
	}
);

Company.findById = function (id) {
	return this.findByPk(id, {
		include: {
			model: CompanyImage,
			as: 'companyImages'
		}
	});
}

Company.associate = (models) => {
	models.Company.belongsTo(models.User, {
		foreignKey: "userId",
		as: "user",
		constraints: false
	});
	models.Company.hasMany(models.CompanyImage, {
		foreignKey: "companyId",
		as: 'companyImages',
		constraints: false
	});
}

Company.prototype.toJSON = function () {
	const values = { ...this.get() };
	values.logoImage = process.env.BASE_URL + '/' + values.logoImage;
	values.heroImage = process.env.BASE_URL + '/' + values.heroImage;
	return values;
}

module.exports = Company;
