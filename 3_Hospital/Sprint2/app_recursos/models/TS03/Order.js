module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {

		ord_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true  },
		ord_asset_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ord_quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		ord_date: { type: DataTypes.DATE,
            allowNull: true
        },
		ord_status: { type: DataTypes.DATE,
            allowNull: true
        },
	},{
		freezeTableName: true,
		timestamps: false,
	});	

	Order.associate = function(models){

		Order.belongsToMany(models.Hospital,
			{
				through: 'Ord_seller_consumer',
				foreignKey: 'ord_id',
	
				onDelete: 'CASCADE', 
				hooks: true  ,
				otherKey: 'osc_consumer_id',
			});

		Order.belongsToMany(models.Provider,
			{
				through: 'Ord_seller_consumer',
				foreignKey: 'ord_id',
							onDelete: 'CASCADE', 
				hooks: true  ,
				otherKey: 'osc_seller_id',
			});

		Order.hasMany(models.Ord_seller_consumer,{
				foreignKey: 'ord_id',
			});

	}
	
    return Order;

};


