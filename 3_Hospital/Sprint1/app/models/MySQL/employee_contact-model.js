
module.exports = (sequelize, DataTypes) => {
    const Employee_contact = sequelize.define('Employee_contact', {
        con_id: { type: DataTypes.INTEGER, foreignKey: true},
        emp_id: { type: DataTypes.INTEGER, foreignKey: true},
    }, {
        freezeTableName: true,
        timestamps: false,
        underscored: true,
    });

    Employee_contact.associate = function(models){
        Employee_contact.hasOne(models.Employee, 
            {
                foreignKey: 'emp_id',
                sourceKey: 'emp_id',
                onDelete: 'CASCADE',
                hooks: true
            });
        Employee_contact.hasOne(models.Contact, 
            {
                foreignKey: 'con_id',
                sourceKey: 'con_id',
                onDelete: 'CASCADE',
                hooks: true
            });
    }

    return Employee_contact;

};
