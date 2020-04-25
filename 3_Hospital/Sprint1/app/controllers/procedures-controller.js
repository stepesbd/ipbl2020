'use strict';
const { Medical_procedures } = require('../models');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.post = (req, res, next) => {
    var me = req.body;

    Medical_procedures.create({
        med_proc_cbhpm_code: me.inputCBHPM,
        med_proc_desc: me.inputDesc.toUpperCase(),
        med_proc_uco: me.inputUCO,
    }).then(function(med_proc){
        // SUCESSO
        res.redirect('/procedures')
    }).catch(err => {
        var erro = err.message;
        res.render('erro-page', { title: 'Erro', erro: erro} );
    });   
   
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.get = (req, res, next) => {


    if(!req.params.proc_id){
        Medical_procedures.findAll({ order: [['med_proc_id', 'ASC']] }).then(function (med_proc) {
            res.render('procedimentos-lista', { title: 'Lista de Procedimentos', med_proc: med_proc})
        })
    }else{
        Medical_procedures.findOne(
            { where: {med_proc_id: req.params.proc_id}},
        ).then(function (med_proc) {

            ////////////// ENCONTRAR QUANTOS HOSPITAIS E CONTAR O NUMERO DE REGISTROS OU INFORMAR O NOME DELES
            res.render('procedimentos-atualizacao', { title: 'Procedimento', med_proc: med_proc})
        })
    }

};

///////////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////

exports.new = (req, res, next) => {
    res.render('procedimentos-cadastro', { title: 'Cadastro de Procedimento'})
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.update =  (req, res) => {

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.delete = (req, res, next) => {
    Medical_procedures.findByPk(req.params.proc_id).then(function(med_proc){

        /////////////////////////////////////////////////////////////////////ENCONTRAR A RELAÇÃO HOS MED PROC

        Medical_procedures.destroy({where: {med_proc_id: req.params.proc_id}});
        
        Medical_procedures.findAll().then(function(med_proc){
            res.render('procedimentos-lista', { title: 'Lista de Procedimentos', med_proc: med_proc } );
        }).catch(err => {
            var erro = err.message;
            res.render('erro-page', { title: 'Erro', erro: erro} );
        });
        
    }).catch(err => {
        var erro = err.message;
        res.render('erro-page', { title: 'Erro', erro: erro} );
    });
}
