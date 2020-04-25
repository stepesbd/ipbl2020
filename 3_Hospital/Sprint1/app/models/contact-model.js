module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('Contact', {
        con_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        con_desc: { 
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: {
					args: /[\x20-\xff]{1,100}/,
					msg: 'A descrição do contato deve conter entre 1 e 100 caracteres alfanumericos'
				}
			}
        },
        con_type: { type: DataTypes.STRING,
            allowNull: false
        },
	
	},{
		freezeTableName: true,
		timestamps: false,
	});	
	
    Contact.associate = function(models){
        Contact.belongsToMany(models.Hospital,
			{
				through: 'Hospital_contact',
				foreignKey: 'con_id',
				onDelete: 'CASCADE', 
				hooks: true  ,
				otherKey: 'hos_id',
        });

        Contact.belongsToMany(models.Employee,
			{
				through: 'Employee_contact',
				foreignKey: 'con_id',
				onDelete: 'CASCADE', 
				hooks: true  ,
				otherKey: 'emp_id',
        });

		Contact.hasMany(models.Hospital_contact,{
			foreignKey: 'con_id',
        });
        
        Contact.hasMany(models.Employee_contact,{
			foreignKey: 'con_id',
	   	});
    }

    return Contact;

};


