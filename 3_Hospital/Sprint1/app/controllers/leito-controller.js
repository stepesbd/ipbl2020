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
    Bed.findOne({ where: {hos_id: req.params.hosp_id } }
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
    Employee.findByPk(req.params.employee_id).then(function(emp){
            Contact.findAll({
                raw: true,
                include: [{
                    model: Employee_contact,
                    where: { emp_id: emp.emp_id }
                }]
            }).then(function(con){
                for(var i = 0 ; i < con.length ; i++){
                    Contact.destroy({where: {con_id: con[i].con_id}});
                }
                Address.destroy({where: {add_id: emp.add_id}});
                Employee.destroy({where: {emp_id: emp.emp_id}});
            }).catch(err => {
                var erro = err.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            });
            Hospital.findByPk(req.params.hosp_id).then(function(hos){
                res.render('success-page', { title: 'Sucesso', success: 'Leito APAGADO com sucesso! Clique no botão abaixo para ser direcionado à página do(a) ' + hos.hos_name, page: '/Hospital/' + req.params.hosp_id + '/leito/sts/active'} );
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
exports.update = (req, res, next) => {
    var me = req.body;

            Employee.findByPk(req.params.employee_id).then(function(emp){
                Employee.findOne({
                    where: { emp_cns_code: me.inputCNS }
                }).then(function(empCNScheckRepeat){
                    // INVALIDAÇÃO EM CASO DE CNS REPETIDO
                    if( (empCNScheckRepeat == null) || (empCNScheckRepeat.emp_cns_code.localeCompare(emp.emp_cns_code) === 0) ){
                        Address.update({
                                add_street: me.inputStreet.toUpperCase(),
                                add_number: me.inputNumber,
                                add_city: me.inputCity.toUpperCase(),
                                add_state: me.inputState.toUpperCase(),
                                add_country: me.inputCountry.toUpperCase(),
                                add_zip_code: me.inputZipCode.toUpperCase(),
                            },{
                            where: { add_id: emp.add_id }
                        }).then(() => {
                            Hospital_employee.update({
                                hos_emp_admission_date: me.inputAdmi,
                                hos_emp_demission_date: me.inputDemiss,
                                hos_emp_salary: me.inputSalary
                            },{
                                where: { emp_id: emp.emp_id }
                            }).then(() => {
                                Employee.update({
                                    emp_name : me.inputNome.toUpperCase(),
                                    emp_cns_code: me.inputCNS,
                                    emp_occupation : me.inputFuncao.toUpperCase(),
                                    add_id: emp.add_id
                                },{
                                    where: { emp_id: req.params.employee_id }
                                }).then(() => {
                                    Contact.findAll({
                                        raw: true,
                                        include: [{
                                            model: Employee_contact,
                                            where: { emp_id: req.params.employee_id }
                                        }]
                                    }).then(function (old_contacs) {
                                        // REMOVENDO TODAS ASSOCIAÇÕES ANTERIORES
                                        old_contacs.forEach(function(old_con){
                                            Contact.destroy({ where: { con_id: old_con.con_id } })
                                        });
                                        // NECESSÁRIO PARA EVITAR BUG DE PROCEDIMENTO UNIÁRIO VINDO COMO STRING AO INVÉS DE ARRAY
                                        if( me.inputContactBox[0] != null ){
                                            
                                            var arrayOfContactTypes = []
                                            var arrayOfContactBox = []
                            
                                            if(!Array.isArray(me.inputContactType)){
                                                arrayOfContactTypes.push(me.inputContactType);
                                            }else{
                                                arrayOfContactTypes = me.inputContactType;
                                            };
                                            if(!Array.isArray(me.inputContactBox)){
                                                arrayOfContactBox.push(me.inputContactBox);
                                            }else{
                                                arrayOfContactBox = me.inputContactBox;
                                            };

                                            arrayOfContactTypes.forEach(function(contactType){
                                                if(arrayOfContactBox[0].length > 0){
                                                    Contact.create({
                                                        con_type: contactType,
                                                        con_desc: arrayOfContactBox.shift(),
                                                    }).then(function(con){
                                                        con.addEmployee(emp);
                                                    }).catch(err => {
                                                        con.destroy();
                                                        var erro = err.message;
                                                        res.render('erro-page', { title: 'Erro', erro: erro} );
                                                    });  
                                                }
                                            })
                                        }
                                        Hospital.findByPk(req.params.hosp_id).then(function(hos){
                                            res.render('success-page', { title: 'Sucesso', success: 'Leito ATUALIZADO com sucesso! Clique no botão abaixo para ser direcionado à página do(a) ' + hos.hos_name, page: '/Hospital/' + req.params.hosp_id + '/leito/sts/active'} );
                                        }).catch(err => {
                                            var erro = err.message;
                                            res.render('erro-page', { title: 'Erro', erro: erro} );
                                        });
                                    });
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
                    }else{
                        var erro = 'CNS já cadastrado!';
                        res.render('erro-page', { title: 'Erro', erro: erro} );
                    }
                });
            })
        
}
//#endregion