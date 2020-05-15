module.exports = (sequelize, DataTypes) => {
    const Hosp_med_proc = sequelize.define('Hosp_med_proc', {
        hos_id: { type: DataTypes.INTEGER, foreignKey: true},
        med_proc_id: { type: DataTypes.INTEGER, foreignKey: true},
        hos_med_proc_value: { type: DataTypes.STRING,
            allowNull: false,
        },
	},{
		freezeTableName: true,
		timestamps: false,
	});	
	
    Hosp_med_proc.associate = function(models){


        Hosp_med_proc.hasOne(models.Hospital, 
            {
                foreignKey: 'hos_id',
                sourceKey: 'hos_id',
                onDelete: 'CASCADE',
                hooks: true
            });

        Hosp_med_proc.hasOne(models.Medical_procedures, 
            {
                foreignKey: 'med_proc_id',
                sourceKey: 'med_proc_id',
                onDelete: 'CASCADE',
                hooks: true
            });
    }

    return Hosp_med_proc;

};


