module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
		add_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		add_street: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		add_number: { type: DataTypes.INTEGER,
			allowNull: false
		},
		add_city: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		add_state: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		add_country: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		add_zip_code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},{
		freezeTableName: true,
		timestamps: false,
		underscored: true,
	});

	Address.associate = function(models){
		Address.hasMany(models.Hospital, 
			{
				foreignKey: 'add_id', 
				onDelete: 'CASCADE', 
				hooks: true 
			}
		);
	};

	return Address;

};