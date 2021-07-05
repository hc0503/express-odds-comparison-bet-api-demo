const { DataTypes } = require('sequelize');
const database = require('#services/db.service');

const CompanyImage = database.define(
	'CompanyImage',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		companyId: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			required: true,
			allowNull: false
		},
		image: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
	},
	{
		timestamps: true,
	}
);

CompanyImage.associate = (models) => {
	models.CompanyImage.belongsTo(models.Company, {
		foreignKey: "companyId",
		as: "company",
		constraints: false
	});
}
CompanyImage.prototype.toJSON = function () {
	const values = { ...this.get() };
	values.image = process.env.BASE_URL + '/' + values.image;
	return values;
}
CompanyImage.findById = function (id) {
	return this.findByPk(id);
}


module.exports = CompanyImage;
