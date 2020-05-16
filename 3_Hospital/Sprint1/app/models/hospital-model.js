module.exports = (sequelize, DataTypes) => {
    const Hospital = sequelize.define('Hospital', {

		hos_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true  },
		hos_cnpj: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				is: {
					args: /\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}/,
					msg: 'CNPJ deve ser no formato 12.345.678/9999-00'
				},
				isCNPJ(value) {
					/* Creditos: http://araujo.cc/blog/funcao-javascript-para-validar-cnpj.html */
					var b = [6,5,4,3,2,9,8,7,6,5,4,3,2];

					if((c = value.replace(/[^\d]/g,"")).length != 14)
						throw new Error('Verifique o CNPJ. Item invalido!');

					if(/0{14}/.test(c))
						throw new Error('Verifique o CNPJ. Item invalido!');

					for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
					if(c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
						throw new Error('Verifique o CNPJ. Item invalido!');

					for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
					if(c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
						throw new Error('Verifique o CNPJ. Item invalido!');
				},
			}
		},
		hos_cnes_code: { 
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				is: {
					args: /[\x20-\xff]{7,7}/,
					msg: 'Código CNES do Hospital deve conter 7 caracteres alfanumericos'
				}
			}
		},
		hos_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: {
					args: /[\x20-\xff]{5,100}/,
					msg: 'Nome do Hospital deve conter entre 5 e 100 caracteres alfanumericos'
				}
			}
		},
		hos_corporate_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: {
					args: /[\x20-\xff]{10,100}/,
					msg: 'A razão social do Hospital deve conter entre 10 e 100 caracteres alfanumericos'
				}
			}
		},
		hos_privateKey: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		hos_publicKey: {
			type: DataTypes.STRING,
			allowNull: true,
		}

	},{
		freezeTableName: true,
		timestamps: false,
	});	
	
    Hospital.associate = function(models){
		Hospital.belongsToMany(models.Employee,
		{
			through: 'Hospital_employee',
			foreignKey: 'hos_id',

			onDelete: 'CASCADE', 
            hooks: true  ,
			otherKey: 'emp_id',
		});
		
		Hospital.hasOne(models.Address,
		{
            foreignKey: 'add_id',
            targetKey: 'add_id',
            onDelete: 'CASCADE',
            hooks: true
		});
		
		Hospital.belongsToMany(models.Medical_procedures,
			{
				through: 'Hosp_med_proc',
				foreignKey: 'hos_id',
	
				onDelete: 'CASCADE', 
				hooks: true  ,
				otherKey: 'med_proc_id',
		});

		Hospital.belongsToMany(models.Contact,
			{
				through: 'Hospital_contact',
				foreignKey: 'hos_id',
	
				onDelete: 'CASCADE', 
				hooks: true  ,
				otherKey: 'con_id',
		});


		Hospital.hasMany(models.Hospital_employee,{
			foreignKey: 'hos_id',
		});
		   
		Hospital.hasMany(models.Hosp_med_proc,{
			foreignKey: 'hos_id',
		   });
		   
		Hospital.hasMany(models.Hospital_contact,{
			foreignKey: 'hos_id',
	   	});

    }

    return Hospital;

};


