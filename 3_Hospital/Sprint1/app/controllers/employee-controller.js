'use strict';
const { Address } = require('../models');
const { Employee } = require('../models');
const { Hospital } = require('../models');
const { Hospital_employee } = require('../models');
const { Op } = require("sequelize");



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
        Employee.create({
            emp_name : me.inputNome.toUpperCase(),
            emp_cns_code: me.inputCNS,
            emp_occupation : me.inputFuncao.toUpperCase(),
            add_id: add.add_id,
            }).then(function(emp) {
                Hospital.findByPk(req.params.hosp_id).then(function(hosp){
                    // Associação hospital - employee
                    hosp.addEmployee(emp, { 
                        through: { 
                            hos_emp_admission_date: me.inputAdmi,
                            hos_emp_demission_date: me.inputDemiss,
                            hos_emp_salary: me.inputSalary,
                        } 
                    })
                    res.redirect('/Hospital/' + req.params.hosp_id + '/employee/sts/active')
                });
            }).catch(errEmplCrea => {
                add.destroy()
                var erro ='Funcionário não pode ser cadastrado, verifique a validade dos dados informados! ' +  errEmplCrea.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            })
        }).catch(errAddrCrea => {
            var erro ='Funcionário não pode ser cadastrado, verifique a validade dos dados informados! ' +  errAddrCrea.message;
            res.render('erro-page', { title: 'Erro', erro: erro} );
        });
};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/************ LISTA DE FUNCIONÁRIOS **************/
exports.get = (req, res, next) => {

    if(!req.params.employee_id){
        var erro = 'Erro: Funcionários não encontrados!';
        if(req.params.sts == 'active'){
            Hospital.findByPk(req.params.hosp_id).then(function(hosp){
                Hospital_employee.findAll({
                    raw: true,
                    where: {
                        hos_id: req.params.hosp_id,
                        hos_emp_demission_date: null
                    },
                    include: [{
                        model: Employee,
                        order: [['emp_name', 'ASC']],
                    }]
                }).then(function(hos_emp){
                    Employee.findAll({
                        raw: true,
                        include:[{
                            model: Hospital_employee,
                            where:{ 
                                hos_id: req.params.hosp_id,
                                hos_emp_demission_date: null         /***************  CRITÉRIO DE ATIVIDADE */
                            }
                        }],
                        order: [['emp_name', 'ASC']],
                    }).then(function(emp){
                        res.render('funcionario-lista', { title: 'Lista de Funcionários', hosp: hosp, hos_emp: hos_emp, emp: emp, active: 'active', inactive: ''} );
                    }).catch(erroEmplFound => {
                        console.log(erro + erroEmplFound.message),
                        res.status(500).json(erro + erroEmplFound.message);
                    });

                })
            })

        }else{
            Hospital_employee.findAll({
                raw: true,
                where: {
                    hos_id: req.params.hosp_id,
                    hos_emp_demission_date: {[Op.not]: null}        /***************  CRITÉRIO DE INATIVIDADE */
                },
                order: [['hos_id', 'ASC']],
            }).then(function(hos_emp){
                Hospital.findByPk(req.params.hosp_id)
                .then(function(hosp){
                    Employee.findAll({
                        order: [['emp_name', 'ASC']],
                        include: [{ 
                            model: Hospital, 
                            through: { 
                                model: Hospital_employee,
                                where: { hos_emp_demission_date: {[Op.not]: null }}
                            },
                            where: { hos_id: req.params.hosp_id},
                        }]
                    }).then(function(emp){
                        res.render('funcionario-lista', { title: 'Lista de Funcionários', hosp: hosp, emp: emp, hos_emp: hos_emp, active: '', inactive: 'active'} );
                    }).catch(erroEmplFound => {
                        console.log(erro + erroEmplFound.message),
                        res.status(500).json(erro + erroEmplFound.message);
                    })
                }).catch(errorHospFound => {
                    console.log(erro + errorHospFound.message);
                    res.status(500).json(erro + errorHospFound.message);
                })  
            }).catch(errHosEmp => {
                console.log(erro + errHosEmp.message);
                res.status(500).json(erro + errHosEmp.message);
            })
        }
    }else{
        /************ ATUALIZAÇÃO DE FUNCIONÁRIOO **************/
        Hospital.findByPk(req.params.hosp_id).then(function(hos){
            Employee.findOne(
                { where: {emp_id: req.params.employee_id}},
            ).then(function (emp) {
                Address.findOne({ where: { add_id: emp.add_id } }).then(function (add) {
                    Hospital_employee.findOne({
                        where: { emp_id: emp.emp_id },
                        include: [{
                            model: Hospital,
                            where: { hos_id: req.params.hosp_id }
                        }]
                    }).then(function(hos_emp){

                        res.render('funcionario-atualizacao', { title: 'Hospital', emp: emp, add: add, hos: hos, hos_emp: hos_emp})
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
        }).catch(err => {
            var erro = err.message;
            res.render('erro-page', { title: 'Erro', erro: erro} );
        });   
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


exports.new = (req, res, next) => {
    //res.render('funcionario-cadastro', { title: 'Cadastro de Funcionário'}) 

    Hospital.findOne({ where: {hos_id: req.params.hosp_id } }
        ).then(function (hosp) {
            res.render('funcionario-cadastro', { title: 'Cadastro de Funcionário', hosp: hosp })}   
        ).catch(err => {
            var erro = err.message;
            res.render('erro-page', { title: 'Erro', erro: erro} );
        });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


exports.delete = (req, res, next) => {
    Employee.findByPk(req.params.employee_id).then(function(emp){
            Address.destroy({where: {add_id: emp.add_id}});
            Employee.destroy({where: {emp_id: emp.emp_id}});
            
            res.redirect('/Hospital/' + req.params.hosp_id + '/employee/sts/active');
    }).catch(err => {
        var erro = err.message;
        res.render('erro-page', { title: 'Erro', erro: erro} );
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.update = (req, res, next) => {
    var me = req.body;

    Employee.findOne({
        where: { emp_id: req.params.employee_id }
    }).then(function(emp){
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
                    res.redirect('/Hospital/' + req.params.hosp_id + '/employee/sts/active')
                }).catch(err => {
                    var erro = err.message +'3';
                    res.render('erro-page', { title: 'Erro', erro: erro} );
                }); 
            }).catch(err => {
                var erro = err.message +'2';
                res.render('erro-page', { title: 'Erro', erro: erro} );
            }); 
        }).catch(err => {
            var erro = err.message + '1';
            res.render('erro-page', { title: 'Erro', erro: erro} );
        });   
    })
}