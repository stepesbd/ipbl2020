const Sequelize = require('sequelize')

//conexao com banco
const sequelize = new Sequelize('user', 'pwd', 'database', { 
    host: "host",
    dialect: 'mysql' ,
    define: {
		createdAt: false,
		updatedAt: false,
        freezeTableName: true //http://docs.sequelizejs.com/manual/models-definition.html#configuration
    }
})

sequelize.authenticate().then(function (){
    console.log("Conectado com sucesso no banco MySQL !")
}).catch(function (erro){
    console.log("Falha ao se conectar: " + erro)
})

module.exports = {
    Sequelize:Sequelize,
    sequelize:sequelize
}