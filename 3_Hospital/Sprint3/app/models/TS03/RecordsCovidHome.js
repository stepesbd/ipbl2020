

module.exports = (sequelize, DataTypes) => {
    const RecordsCovidHome = sequelize.define('RecordsCovidHome', {
        rec_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        rec_paciente_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
        },
        rec_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rec_date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rec_cpf: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rec_medrec_id: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{
        freezeTableName: true,
        underscored: true,
		timestamps: false,
	});
    return RecordsCovidHome;
};
