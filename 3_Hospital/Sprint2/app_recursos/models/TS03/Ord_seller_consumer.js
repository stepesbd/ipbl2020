
module.exports = (sequelize, DataTypes) => {
    const Ord_seller_consumer = sequelize.define('Ord_seller_consumer', {
        ord_id: { type: DataTypes.INTEGER, foreignKey: true},
		osc_seller_id: { type: DataTypes.INTEGER, foreignKey: true},
		osc_consumer_id: { type: DataTypes.INTEGER, foreignKey: true},
    }, {
        freezeTableName: true,
        timestamps: false,
        underscored: true,
    });

    Ord_seller_consumer.associate = function(models){


        Ord_seller_consumer.hasOne(models.Order, 
            {
                foreignKey: 'ord_id',
                sourceKey: 'ord_id',
                onDelete: 'CASCADE',
                hooks: true
            });

        Ord_seller_consumer.hasOne(models.Hospital, 
            {
				foreignKey: 'hos_id',
                sourceKey: 'osc_consumer_id',
                onDelete: 'CASCADE',
                hooks: true
			});
		Ord_seller_consumer.hasOne(models.Provider, 
			{
				foreignKey: 'pro_id',
				sourceKey: 'osc_seller_id',
				onDelete: 'CASCADE',
				hooks: true
			});

    }

    return Ord_seller_consumer;

};

