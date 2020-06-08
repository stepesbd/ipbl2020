module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
		add_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		add_street: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: {
					args: /[\x20-\xff]{5,50}/,
					msg: 'A rua deve conter entre 5 e 50 caracteres alfanumericos'
				}
			}
		},
		add_number: { type: DataTypes.INTEGER,
			allowNull: false
		},
		add_city: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: {
					args: /[\x20-\xff]{1,50}/,
					msg: 'A cidade deve conter entre 1 e 50 caracteres alfanumericos'
				}
			}
		},
		add_state: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: {
					args: /[\x20-\xff]{1,50}/,
					msg: 'O estado deve conter entre 1 e 50 caracteres alfanumericos'
				}
			}
		},
		add_country: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: {
					args: /[\x20-\xff]{1,50}/,
					msg: 'O país deve conter entre 1 e 50 caracteres alfanumericos'
				}
			}
		},
		add_zip_code: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: {
					args: /[\x20-\xff]{1,20}/,
					msg: 'O código postal deve conter entre 1 e 20 caracteres alfanumericos'
				}
			}
		},
		add_latitude: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		add_longitude: {
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
		Address.hasMany(models.Employee, 
			{
				foreignKey: 'add_id', 
				onDelete: 'CASCADE', 
				hooks: true 
			}
		);
	};

	return Address;

};