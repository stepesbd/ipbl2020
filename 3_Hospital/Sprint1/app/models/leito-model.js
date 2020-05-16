

module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define('Employee', {
        emp_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        emp_cns_code: { 
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /[\x20-\xff]{15,15}/,
                    msg: 'O código CNS deve conter 15 caracteres alfanumericos'
                }
            }
        },
        emp_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /[\x20-\xff]{5,100}/,
                    msg: 'Nome do Funcionário deve conter entre 5 e 100 caracteres alfanumericos'
                }
            }
        },
        emp_occupation: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /[\x20-\xff]{1,100}/,
                    msg: 'A função do funcionário deve conter entre 1 e 100 caracteres alfanumericos'
                }
            }
        },
    },{
        freezeTableName: true,
        underscored: true,
		timestamps: false,
	});

    Employee.associate = function(models){
        Employee.belongsToMany(models.Hospital, 
        {
            through: 'Hospital_employee',
            foreignKey: 'emp_id', 
            onDelete: 'CASCADE', 
            hooks: true  ,
            otherKey: 'hos_id',
        });

        Employee.belongsToMany(models.Contact,
			{
				through: 'Employee_contact',
				foreignKey: 'emp_id',
	
				onDelete: 'CASCADE', 
				hooks: true  ,
				otherKey: 'con_id',
		});

        Employee.hasOne(models.Address,
        {
            foreignKey: 'add_id',
            targetKey: 'add_id',
            onDelete: 'CASCADE',
            hooks: true
        });


      Employee.hasMany(models.Hospital_employee,{
           foreignKey: 'emp_id',
      });

      Employee.hasMany(models.Employee_contact,{
        foreignKey: 'emp_id',
       });

    }


    return Employee;

};
