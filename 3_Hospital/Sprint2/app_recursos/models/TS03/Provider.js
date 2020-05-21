module.exports = (sequelize, DataTypes) => {
    const Provider = sequelize.define('Provider', {

		pro_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true  },
		pro_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		pro_privateKey: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		pro_publicKey: {
			type: DataTypes.STRING,
			allowNull: true,
		}

	},{
		freezeTableName: true,
		timestamps: false,
	});	

	Provider.associate = function(models){
		Provider.belongsToMany(models.Order,
		{
			through: 'Ord_seller_consumer',
			foreignKey: 'osc_seller_id',
			onDelete: 'CASCADE', 
			hooks: true  ,
			otherKey: 'ord_id',
		});
		Provider.hasMany(models.Ord_seller_consumer,{
			foreignKey: 'osc_seller_id',
		});
	}
	
    return Provider;

};


