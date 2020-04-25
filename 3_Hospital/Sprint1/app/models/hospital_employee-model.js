
module.exports = (sequelize, DataTypes) => {
    const Hospital_employee = sequelize.define('Hospital_employee', {
        hos_id: { type: DataTypes.INTEGER, foreignKey: true},
        emp_id: { type: DataTypes.INTEGER, foreignKey: true},
        hos_emp_admission_date: { type: DataTypes.DATE,
            allowNull: false
        },
        hos_emp_demission_date: { type: DataTypes.DATE,
            allowNull: true
        },
        hos_emp_salary: { type: DataTypes.STRING,
            allowNull: false
        },

    }, {
        freezeTableName: true,
        timestamps: false,
        underscored: true,
    });

    Hospital_employee.associate = function(models){


        Hospital_employee.hasOne(models.Employee, 
            {
                foreignKey: 'emp_id',
                sourceKey: 'emp_id',
                onDelete: 'CASCADE',
                hooks: true
            });

        Hospital_employee.hasOne(models.Hospital, 
            {
                foreignKey: 'hos_id',
                sourceKey: 'hos_id',
                onDelete: 'CASCADE',
                hooks: true
            });

    }

    return Hospital_employee;

};

