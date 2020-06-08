module.exports = (sequelize, DataTypes) => {
    const Bed_sector = sequelize.define('Bed_sector', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        sector_desc: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /[\x20-\xff]{5,100}/,
                    msg: 'Nome do setor deve conter entre 3 e 10 caracteres'
                }
            }
        }        
    },{
        freezeTableName: true,
        underscored: true,
		timestamps: false,
    });
    
    return Bed_sector;
};
