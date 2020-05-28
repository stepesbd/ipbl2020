'use strict';
const { Address } = require('../models');
const { Bed } = require('../models');
const { Hospital } = require('../models');
const { Op } = require("sequelize");


//#region  Criando leitos em um hospital
exports.post = (req, res, next) => {
    let me = req.body; 
    let hos_id = req.params.hosp_id;
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
                bed_status: 0,
                hos_id: hos_id,
            }).then(function(bed){
                res.render('success-page', { title: 'Sucesso', success: 'Leito CRIADO com sucesso! Clique no botão abaixo para ser direcionado à lista de leitos.', page: '/Hospital/' + hos_id + '/leito/sts/' +  hos_id} );
            }).catch(err => {
                var erro = err.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            });
        } else { 
            var erro = 'Leito já cadastrado!';
            res.render('erro-page', { title: 'Erro', erro: erro} );
        }
    });
};
//#endregion


//#region  Buscando informações de leitos de um hospital
exports.get = (req, res, next) => {
    Hospital.findByPk(req.params.id).then(function(hos){
        Bed.findAll({
            raw: true,
            where: {
                hos_id: req.params.id,
                bed_status: 0
            }
        }).then(function(bed){
                res.render('leito-lista', { title: 'Lista de Leitos', hos: hos,  bed: bed,} );
            }).catch(err => {
                var erro = err.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            });  
        }).catch(err => {
            var erro = err.message;
            res.render('erro-page', { title: 'Erro', erro: erro} );
        });  
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
        Bed.destroy({ where : {bed_id : bed.bed_id}})                                        
            Hospital.findByPk(req.params.hosp_id).then(function(hos){
                res.render('success-page', { title: 'Sucesso', success: 'Leito Desativado com sucesso! Clique no botão abaixo para ser direcionado à página de Leitos do(a) ' + hos.hos_name, page: '/Hospital/' + req.params.hosp_id + '/leito/sts/'+ req.params.hosp_id } );
            }).catch(err => {
                var erro = err.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            });
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
            where: { bed_id: id, bed_name:  me.inputDesc}
        }).then(function(bedName){
            // INVALIDAÇÃO EM CASO DE CGHPM REPETIDO
            if( (bedName == null) ){
                Bed.update(
                    {
                        bed_name : me.inputDesc
                    },{
                        where: { bed_id: id }
                }).then(()=>{
                    res.render('success-page', { title: 'Sucesso', success: 'Leito ATUALIZADO com sucesso! Clique no botão abaixo para ser direcionado à lista de leitos.', page: '/Hospital/'+bed.hos_id +'/leito/sts/'+ bed.hos_id } );
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