module.exports = (sequelize, DataTypes) => {
    const Medical_procedures = sequelize.define('Medical_procedures', {
        med_proc_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        med_proc_cbhpm_code: { 
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: {
					args: /[\x20-\xff]{7,7}/,
					msg: 'Código CBHPM do Procedimento deve conter 8 caracteres alfanumericos'
				}
			}
        },
        med_proc_desc: { 
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: {
					args: /[\x20-\xff]{5,255}/,
					msg: 'A descrição do Procedimento deve conter entre 5 e 100 caracteres alfanumericos'
				}
			}
        },
        med_proc_uco: { type: DataTypes.STRING,
            allowNull: false
        },
	
	},{
		freezeTableName: true,
		timestamps: false,
	});	
	
    Medical_procedures.associate = function(models){
        Medical_procedures.belongsToMany(models.Hospital,
			{
				through: 'Hosp_med_proc',
				foreignKey: 'med_proc_id',
				onDelete: 'CASCADE', 
				hooks: true  ,
				otherKey: 'hos_id',
		});
		   
		Medical_procedures.hasMany(models.Hosp_med_proc,{
			foreignKey: 'med_proc_id',
	   	});
    }

    return Medical_procedures;

};


