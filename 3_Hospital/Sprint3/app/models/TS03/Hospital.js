module.exports = (sequelize, DataTypes) => {
    const Hospital = sequelize.define('Hospital', {

		hos_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true  },
		hos_cnpj: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		hos_cnes_code: { 
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		hos_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		hos_corporate_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		hos_privateKey: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		hos_publicKey: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		add_id: { type: DataTypes.INTEGER, foreignKey: true},

	},{
		freezeTableName: true,
		timestamps: false,
	});	

	Hospital.associate = function(models){
		Hospital.hasOne(models.Address,
			{
				foreignKey: 'add_id',
				targetKey: 'add_id',
				onDelete: 'CASCADE',
				hooks: true
			});

	}
	
    return Hospital;

};


