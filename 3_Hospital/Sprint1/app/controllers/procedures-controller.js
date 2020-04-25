'use strict';
const { Medical_procedures } = require('../models');
const { Hosp_med_proc } = require('../models');
const { Hospital } = require('../models');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    MÉTODO POST
*/
exports.post = (req, res, next) => {
    var me = req.body;
    Medical_procedures.findOne({
        where: { med_proc_cbhpm_code: me.inputCBHPM }
    }).then(function(CGHPMrepeat){
        // INVALIDAÇÃO EM CASO DE CNES REPETIDO
        if(CGHPMrepeat == null){
            
            Medical_procedures.create({
                med_proc_cbhpm_code: me.inputCBHPM,
                med_proc_desc: me.inputDesc.toUpperCase(),
                med_proc_uco: me.inputUCO,
            }).then(function(med_proc){
                res.render('success-page', { title: 'Sucesso', success: 'Procedimento CRIADO com sucesso! Clique no botão abaixo para ser direcionado à lista de procedimentos.', page: '/procedures'} );
            }).catch(err => {
                var erro = err.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            }); 

        }else{
            var erro = 'CBHPM já cadastrado!';
            res.render('erro-page', { title: 'Erro', erro: erro} );
        }
    })
          
   
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    MÉTODO GET
*/
exports.get = (req, res, next) => {

    // NÃO RECEBE PARÂMETRO DE IDENTIFICAÇÃO DO PROCEDIMENTO: RENDERIZA PÁGINA INICIAL DE LISTA DE PROCEDIMENTOS
    if(!req.params.proc_id){
        Medical_procedures.findAll({ 
            raw: true,
            order: [
                ['med_proc_desc', 'ASC'],
            ],
        }).then(function (med_proc) {
            res.render('procedimentos-lista', { title: 'Lista de Procedimentos', med_proc: med_proc})
        })
    }else{
        // SE RECEBE PARÂMETRO, RENDERIZA PÁGINA DE ATUALIZAÇÃO DO PROCEDIMENTO
        Medical_procedures.findOne(
            { where: {med_proc_id: req.params.proc_id}},
        ).then(function (med_proc) {
            Hosp_med_proc.count({
                where: { med_proc_id: med_proc.med_proc_id },
                include: [{
                    model: Hospital,
                    order: [['hos_name', 'ASC']]
                }]
            }).then(function(count){
                Hospital.findAll({
                    raw: true,
                    order: [['hos_name', 'ASC']],
                    include: [{
                        model: Hosp_med_proc,
                        where: { med_proc_id: med_proc.med_proc_id },
                    }]
                }).then(function(hos){
                    Hosp_med_proc.findAll({
                        raw: true,
                        where: { med_proc_id: med_proc.med_proc_id },
                        include: [{
                            model: Hospital,
                        }]
                    }).then(function(hos_med_proc){
                        res.render('procedimentos-atualizacao', { title: 'Procedimento', med_proc: med_proc, hos: hos, hos_med_proc: hos_med_proc, count: count})
                    })
                    
                });
            })
        })
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    MÉTODO NEW
*/
exports.new = (req, res, next) => {
    res.render('procedimentos-cadastro', { title: 'Cadastro de Procedimento'})
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    MÉTODO UPDATE
*/
exports.update =  (req, res) => {
    var me = req.body;

    Medical_procedures.findByPk(req.params.proc_id).then(function(med_proc){
        Medical_procedures.findOne({
            where: { med_proc_cbhpm_code: me.inputCBHPM }
        }).then(function(med_procCheckCGHPMrepeat){
            // INVALIDAÇÃO EM CASO DE CGHPM REPETIDO
            if( (med_procCheckCGHPMrepeat == null) || (med_procCheckCGHPMrepeat.med_proc_cbhpm_code.localeCompare(med_proc.med_proc_cbhpm_code) === 0) ){
                Medical_procedures.update(
                    {
                        med_proc_cbhpm_code: me.inputCBHPM,
                        med_proc_desc: me.inputDesc.toUpperCase(),
                        med_proc_uco: me.inputUCO,
                    },{
                        where: { med_proc_id: req.params.proc_id }
                }).then(()=>{
                    res.render('success-page', { title: 'Sucesso', success: 'Procedimento ATUALIZADO com sucesso! Clique no botão abaixo para ser direcionado à lista de procedimentos.', page: '/procedures'} );
                }).catch(err => {
                    var erro = err.message;
                    res.render('erro-page', { title: 'Erro', erro: erro} );
                });
            }else{
                var erro = 'CBHPM já cadastrado!';
                res.render('erro-page', { title: 'Erro', erro: erro} );
            }
        })
    })
        

            
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    MÉTODO DELETE
*/
exports.delete = (req, res, next) => {
    Medical_procedures.findByPk(req.params.proc_id).then(function(med_proc){

        Medical_procedures.destroy({where: {med_proc_id: req.params.proc_id}});
        
        res.render('success-page', { title: 'Sucesso', success: 'Procedimento APAGADO com sucesso! Clique no botão abaixo para ser direcionado à lista de procedimentos.', page: '/procedures'} );
    }).catch(err => {
        var erro = err.message;
        res.render('erro-page', { title: 'Erro', erro: erro} );
    });
}
