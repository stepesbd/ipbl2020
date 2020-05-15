
module.exports = (sequelize, DataTypes) => {
    const Hospital_contact = sequelize.define('Hospital_contact', {
        con_id: { type: DataTypes.INTEGER, foreignKey: true},
        hos_id: { type: DataTypes.INTEGER, foreignKey: true},
    }, {
        freezeTableName: true,
        timestamps: false,
        underscored: true,
    });

    Hospital_contact.associate = function(models){
        Hospital_contact.hasOne(models.Hospital, 
            {
                foreignKey: 'hos_id',
                sourceKey: 'hos_id',
                onDelete: 'CASCADE',
                hooks: true
            });
        Hospital_contact.hasOne(models.Contact, 
            {
                foreignKey: 'con_id',
                sourceKey: 'con_id',
                onDelete: 'CASCADE',
                hooks: true
            });
    }

    return Hospital_contact;

};
