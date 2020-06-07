'use strict';
let request = require('async-request');
const { Address } = require('../models');
const { Bed } = require('../models');
const { Hospital } = require('../models');
const { Bed_sector} =  require('../models');
const { Op } = require("sequelize");


//#region  Criando leitos em um hospital
exports.post = async (req, res, next) => {
    let me = req.body; 
    let hos_id = req.params.hosp_id;

    // CASO SEJA UMA AÇÃO EM UM LEITO
    if(req.params.bed_id){
        // IDENTIFICANDO O LEITO NO BANCO RELACIONAL
        const bed = await Bed.findOne({where: { bed_id: req.params.bed_id } });
        var action = '';
        if(req.params.action){
            // VERIFICANDO O TIPO DE AÇÃO NO REGISTRO MÉDICO FOI SOLICITADA
            action = req.params.action.toUpperCase();    
            if(action == 'DEATH'){
                var causa_mortis = '';
                // DEFININDO CAUSA MORTIS
                if(req.body.inputCausaMortis == 'COVID-19')
                    causa_mortis = req.body.inputCausaMortis;
                else
                    causa_mortis = req.body.inputCausaMortisText;
                // CASO AÇÃO SEJA PARA DECLARAR ÓBITO DO PACIENTE QUE ESTÁ NO LEITO
                var response = {}
                // SOLICITAÇÃO NA API PARA DECLARAÇÃO DE ÓBITO
                await request("https://stepesbdmedrecords.herokuapp.com/api/records/" + bed.bed_medical_record + '/death', {          // API: PRODUÇÃO
                //await request("http://localhost:2000/api/records/" + bed.bed_medical_record + '/death', {                             // API: LOCALHOST
                    method: 'POST',
                    data: { Causa_mortis: causa_mortis }
                }).then((res)=>{
                    res = JSON.parse(res.body)
                    response = res;
                });
                if(response.Error)
                    return res.render('erro-page', { title: 'Erro', erro: response.Error} );
                else
                    return res.render('success-page', { title: 'Declaração de Óbito', success: 'Realizada a Declaração de Óbito do paciente. Clique no botão abaixo para retornar à página de leitos.', obito: response, page: '/Hospital/' + hos_id + '/leito/list'} );
            }else if(action == 'RELEASE'){
                // CASO A AÇÃO SEJA PARA DAR ALTA AO PACIENTE QUE ESTÁ NO LEITO
                var response = {}
                // SOLICITAÇÃO NA API PARA DECLARAÇÃO DE ALTA MÉDICA
                await request("https://stepesbdmedrecords.herokuapp.com/api/records/" + bed.bed_medical_record + '/release', {  // API: PRODUÇÃO
                //await request("http://localhost:2000/api/records/" + bed.bed_medical_record + '/release', {                      // API: LOCALHOST
                    method: 'POST',
                }).then((res)=>{
                    res = JSON.parse(res.body)
                    response = res;
                });
                if(response.Error)
                    return res.render('erro-page', { title: 'Erro', erro: response.Error} );
                else{
                    return res.render('success-page', { title: 'Alta Médica', success: 'Paciente recebeu Alta com sucesso! Clique no botão abaixo para retornar à página de leitos.', page: '/Hospital/' + hos_id + '/leito/list'} );
                }
            }
        }else
            return res.render('erro-page', { title: 'Erro', erro: 'Solicitação com falta de parâmetros.'} );
    }else{
        // CASO SEJA A CRIAÇÃO DE UM LEITO
        Bed.findOne({
            where: { bed_name: me.inputName}
        }).then(function(count){  
            if(count == null) {
                Bed.create({
                    bed_name: me.inputName,
                    bed_created_at: Date.now(),
                    bed_usage_start: null,
                    bed_usage_end : null,
                    bed_medical_record : null,
                    bed_status: me.inputStatus,
                    hos_id: hos_id,
                    sector_id : me.inputSetor
                }).then(function(bed){
                    res.render('success-page', { title: 'Sucesso', success: 'Leito CRIADO com sucesso! Clique no botão abaixo para ser direcionado à lista de leitos.', page: '/Hospital/' + hos_id + '/leito/list'} );
                }).catch(err => {
                    var erro = err.message;
                    res.render('erro-page', { title: 'Erro', erro: erro} );
                });
            } else { 
                var erro = 'Leito já cadastrado!';
                res.render('erro-page', { title: 'Erro', erro: erro} );
            }
        });
    }
    
        
    
    
};
//#endregion


//#region  Buscando informações de leitos de um hospital
exports.get = async (req, res, next) => {    
    try{

        // VERIFICAÇÃO DE UM PRONTUÁRIO
        if(req.params.bed_id){
            // IDENTIFICANDO O HOSPITAL, ENDEREÇO E LEITO NO BANCO RELACIONAL
            const hos = await Hospital.findByPk(req.params.hosp_id);
            
            const bed = await Bed.findByPk(req.params.bed_id);
            
            const add = await Address.findOne({ 
                include: [{
                    model: Hospital,
                    where: { add_id: hos.add_id },
                    required: true
                }], 
                raw: true 
            });
            const hospital = { hos, add }
            
            // VERIFICANDO PELA API O REGISTRO MÉDICO
            var response = {}
            await request("https://stepesbdmedrecords.herokuapp.com/api/records/" + bed.bed_medical_record, {
                method: 'GET',
            }).then((res)=>{
                res = JSON.parse(res.body)
                response = res;
            });
            //return res.json(response.MedicalRecord);
            // REDIRECIONANDO PARA VISUALIZAÇÃO DO REGISTRO MÉDICO 
            res.render('medical_record', { title: 'Registro Médico', hospital: hospital, att: response.MedicalRecord})
        }else{
            // LISTA DE LEITOS DO HOSPITAL
            Bed.belongsTo(Bed_sector,   {foreignKey: 'sector_id'});
               
            Bed.findAll({                
                        include: [{
                            model: Bed_sector,
                            required: true                                                
                        }],
                        where: {hos_id: req.params.hosp_id}
            }).then(function(bed){
                    Hospital.findOne({ where: {hos_id: req.params.hosp_id} }).then(function (hos) {
                        Bed_sector.findOne().then(function (sct) {
                            res.render('leito-lista', { title: 'Lista de Leitos', hos: hos,  bed: bed, sct: sct} );            
                        })
                    })
            }).catch(err => {
                var erro = err.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            });  
        }


    }catch(err){
        var erro ='Hospital não pode ser cadastrado, verifique a validade dos dados informados! ' +  err.message;
        res.render('erro-page', { title: 'Erro', erro: erro} );
    }

    



};
//#endregion


//#region  Cadastrando  um Leito
exports.new = (req, res, next) => {
    Hospital.findOne({ where: {hos_id: req.params.hosp_id } }
        ).then(function (hosp) {                
                res.render('leito-cadastro', { title: 'Cadastro de Leitos', hosp: hosp })}             
        ).catch(err => {
            var erro = err.message;
            res.render('erro-page', { title: 'Erro', erro: erro} );
        });
};
//#endregion


//#region Deletando informações de Leitos
exports.delete = (req, res, next) => {
    Bed.findByPk(req.params.bed_id).then(function(bed){
        if(bed.bed_status == 0){
            Bed.destroy({ where : {bed_id : bed.bed_id}});                                 
            Hospital.findByPk(req.params.hosp_id).then(function(hos){
                res.render('success-page', { title: 'Sucesso', success: 'Leito Desativado com sucesso! Clique no botão abaixo para ser direcionado à página de Leitos do(a) ' + hos.hos_name, page: '/Hospital/' + req.params.hosp_id + '/leito/list' } );
            }).catch(err => {
                var erro = err.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            });
        }else{
            res.render('erro-page', { title: 'Erro', erro: 'Não é possível desativar um Leito que esteja ocupado.'} );
        }
            

    }).catch(err => {
        var erro = err.message;
        res.render('erro-page', { title: 'Erro', erro: erro} );
    });
}
//#endregion


//#region Atualizando Leitos 

exports.update =  (req, res) => {
    let me = req.body;
    let id = req.params.bed_id;
    Bed.findByPk(id).then(function(bed){
        Bed.findOne({
            where: { bed_id: id, bed_name:  me.inputDesc, sector_id : me.inputSetor, bed_status : me.inputStatus}
        }).then(function(bedName){
            // INVALIDAÇÃO EM CASO DE CGHPM REPETIDO
            if( (bedName == null) ){
                Bed.update(
                    {
                        bed_name : me.inputDesc,
                        sector_id : me.inputSetor,
                        bed_status : me.inputStatus
                    },{
                        where: { bed_id: id }
                }).then(()=>{
                    res.render('success-page', { title: 'Sucesso', success: 'Leito ATUALIZADO com sucesso! Clique no botão abaixo para ser direcionado à lista de leitos.', page: '/Hospital/'+bed.hos_id +'/leito/list' } );
                }).catch(err => {
                    var erro = err.message;
                    res.render('erro-page', { title: 'Erro', erro: erro} );
                });
            }else{
                var erro = 'Leito já cadastrado!';
                res.render('erro-page', { title: 'Erro', erro: erro} );
            }
        })
    });               
}
//#endregion