

module.exports = (sequelize, DataTypes) => {
    const Bed = sequelize.define('Bed', {
        bed_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        bed_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /[\x20-\xff]{5,100}/,
                    msg: 'Nome do leito deve conter entre 3 e 10 caracteres'
                }
            }
        },
        bed_created_at:{
            type: DataTypes.DATE,
            allowNull: false
        },
        bed_usage_start:{
            type: DataTypes.DATE,
            allowNull: true
        },
        bed_usage_end:{
            type: DataTypes.DATE,
            allowNull: true
        },
        bed_medical_record:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        bed_status:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hos_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        sector_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },{
        freezeTableName: true,
        underscored: true,
		timestamps: false,
	});

    Bed.associate = function(models){
        //Bed.belongsToMany(models.Hospital, 
        //{
        //    through: 'Hospital',
        //    foreignKey: 'hos_id', 
        //    onDelete: 'CASCADE', 
        //    hooks: true,
        //    otherKey: 'hos_id',
        //});

        Bed.hasMany(models.Hospital,{
            foreignKey: 'hos_id',
        });
       

    }


    return Bed;
};
