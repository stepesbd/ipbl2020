'use strict';
const { Address } = require('../models');
const { Hospital } = require('../models');
const { Employee } = require('../models');
const { Hospital_employee } = require('../models');
const { Medical_procedures } = require('../models');
const { Hosp_med_proc } = require('../models');

//#region  Criando um Hospital
exports.post = (req, res, next) => {
    var me = req.body;
    Address.create({
        add_street: me.inputStreet.toUpperCase(),
        add_number: me.inputNumber,
        add_city: me.inputCity.toUpperCase(),
        add_state: me.inputState.toUpperCase(),
        add_country: me.inputCountry.toUpperCase(),
        add_zip_code: me.inputZipCode.toUpperCase(),
    }).then(function(add) {
            Hospital.create({
                hos_cnpj: me.inputCNPJ,
                hos_cnes_code: me.inputCNES,
                hos_name: me.inputNome.toUpperCase(),
                hos_corporate_name: me.inputCorporate.toUpperCase(),
                add_id: add.add_id,
            }).then(function(hos) {
                //console.log(req.body)
                //console.log('type of req.body: %s', typeof req.body)
                //console.log('type of req.body.inputProcID: %s', typeof req.body.inputProcID)
                //console.log('is req.body.inputProcID an array?: %s', Array.isArray(req.body.inputProcID))
                //console.log('type of first array element: %s', typeof req.body.inputProcID[0])
                if( me.inputProcID.length > 1 ){
                    var arrayOfProcs = me.inputProcID
                    var arrayOfValues = me.inputValue
                    arrayOfProcs.forEach(function(proc){
                        hos.addMedical_procedures(proc,{
                            through: {
                                hos_med_proc_value: arrayOfValues.pop()
                            }
                        })
                    })
                }else if(me.inputProcID.length === 1){
                    var proc = me.inputProcID;
                    var value = me.inputValue;
                    hos.addMedical_procedures(proc,{
                        through: {
                            hos_med_proc_value: value
                        }
                    })
                }
                res.redirect('/hospital');
            }).catch(err => {
                var erro = err.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            });
        }).catch(errHospCrea => {
            add.destroy();
            var erro ='Hospital não pode ser cadastrado, verifique a validade dos dados informados! ' +  errHospCrea.message;
            res.render('erro-page', { title: 'Erro', erro: erro} );
        })
};
//#endregion 

//#region  Listando Hospitais
exports.get = (req, res, next) => {
    if(!req.params.id){
        Hospital.findAll({ order: [['hos_name', 'ASC']] }).then(function (hos) {
            Medical_procedures.findAll({
                raw: true,
                include: [{
                    model: Hospital,
                    required: true
                }]
            }).then(function(med_proc){
                Hosp_med_proc.findAll({
                    include:{
                        model: Hospital,
                        required: true
                    },
                    include:{
                        model: Medical_procedures,
                        required: true
                    },
                }).then(function(hos_med_proc){
                    //console.log(hos_med_proc)

                    res.render('hospital-lista', { title: 'Lista de Hospitais', hos: hos, med_proc: med_proc, hos_med_proc: hos_med_proc})
                })
            })
        })
    }else{
        Hospital.findOne(
            { where: {hos_id: req.params.id}},
        ).then(function (hos) {
            Address.findOne({ where: { add_id: hos.add_id } }).then(function (add) {
                res.render('hospital-atualizacao', { title: 'Hospital', hos: hos, add: add})
            })
        })
    }
};
//#endregion

//#region  Lista  de  procedimento
exports.new = (req, res, next) => {
    Medical_procedures.findAll({ order: [['med_proc_id', 'ASC']] }).then(function(med_proc){
        res.render('hospital-cadastro', { title: 'Cadastro de Hospital', med_proc: med_proc })
    }).catch(err => {
        var erro = err.message;
        res.render('erro-page', { title: 'Erro', erro: erro} );
    });
};

//#endregion

//#region  Atualizando dados do hospital
exports.update =  (req, res) => {
    var me = req.body;

    Hospital.findOne({ where: {hos_id: req.params.id}})
        .then(function (hos){
            Hospital.update({
                hos_name: me.inputNome.toUpperCase(),
            }, {
                returning: true, 
                where: {hos_id: req.params.id} 
            }, function(err){
                    err.message = 'Hospital nao pode ser removido!';
                    console.log(err.message);
            });

            Address.update(
                {
                    add_street: me.inputStreet.toUpperCase(),
                    add_number: me.inputNumber
                },
                {
                    returning: true, 
                    where: {add_id: hos.add_id} 
                },
                function(err){
                    err.message = 'Endereço não pode ser removido!';
                    console.log(err.message);
                });
    });
        res.redirect('/hospital');
}

//#endregion

//#region  Deletando Hospital
exports.delete = (req, res, next) => {

    var erro = 'Não foi possível apagar o hospital! ';

    Hospital.findByPk(req.params.id).then(function(hos){
            Employee.findAll({
                raw: true,
                include: [{
                    model: Hospital_employee,
                    where: { hos_id: hos.hos_id }
                }]
            }).then(function(emp){
                for(var i = 0 ; i < emp.length ; i++){
                     Address.destroy({where: {add_id: emp[i].add_id}});
                     Employee.destroy({where: {emp_id: emp[i].emp_id}});
                }
                Address.destroy({
                    where: { add_id: hos.add_id }
                }).then(() => {
                    Hospital.destroy({ 
                        where: { hos_id: req.params.id }
                    }).then(() => {
                        res.redirect('/hospital')
                    }).catch(err => {
                        var erro = err.message;
                        res.render('erro-page', { title: 'Erro', erro: erro} );
                    });
                }).catch(err => {
                    var erro = err.message;
                    res.render('erro-page', { title: 'Erro', erro: erro} );
                });
            }).catch(err => {
                var erro = err.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            });
    })
}
//#endregion