'use strict';
const { Address } = require('../models');
const { Employee } = require('../models');
const { Hospital } = require('../models');
const { Hospital_employee } = require('../models');
const { Contact } = require('../models');
const { Employee_contact } = require('../models');
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
                    hosp.addEmployee(emp, { 
                        through: { 
                            hos_emp_admission_date: me.inputAdmi,
                            hos_emp_demission_date: me.inputDemiss,
                            hos_emp_salary: me.inputSalary,
                        } 
                    }).then(()=>{
                        if(me.inputContactBox[0] != null){
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
                        res.render('success-page', { title: 'Sucesso', success: 'Funcionário CRIADO com sucesso! Clique no botão abaixo para ser direcionado à página do(a) ' + hosp.hos_name, page: '/Hospital/' + req.params.hosp_id + '/employee/sts/active'} );
                    })
                });
            }).catch(err => {
                add.destroy()
                var erro = err.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            });  
        }).catch(err => {
            var erro = err.message;
            res.render('erro-page', { title: 'Erro', erro: erro} );
        });  
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.get = (req, res, next) => {
    if(!req.params.employee_id){
        /************ LISTA DE FUNCIONÁRIOS **************/
        var erro = 'Erro: Funcionários não encontrados!';

        if(req.params.sts == 'active'){       
            Hospital.findByPk(req.params.hosp_id).then(function(hosp){
                Hospital_employee.findAll({
                    raw: true,
                    where: {
                        hos_id: req.params.hosp_id,
                        hos_emp_demission_date: {[Op.is]: null}         
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
                                hos_emp_demission_date: {[Op.is]: null}         /***************  CRITÉRIO DE ATIVIDADE */
                            }
                        }],
                        order: [['emp_name', 'ASC']],
                    }).then(function(emp){
                        res.render('funcionario-lista', { title: 'Lista de Funcionários', hosp: hosp, hos_emp: hos_emp, emp: emp, active: 'active', inactive: ''} );
                    }).catch(err => {
                        var erro = err.message;
                        res.render('erro-page', { title: 'Erro', erro: erro} );
                    });  
                }).catch(err => {
                    var erro = err.message;
                    res.render('erro-page', { title: 'Erro', erro: erro} );
                });  
            })
        }else{
            Hospital_employee.findAll({
                raw: true,
                where: {
                    hos_id: req.params.hosp_id,
                    hos_emp_demission_date: { [Op.not] : null }        /***************  CRITÉRIO DE INATIVIDADE */
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
                        Contact.findAll({
                            include: [{
                                model: Employee_contact,
                                where: { emp_id: req.params.employee_id }
                            }]
                        }).then(function(con){
                            var count = 0;
                            con.forEach(()=>{
                                count = count + 1;
                            })
                            res.render('funcionario-atualizacao', { title: 'Hospital', emp: emp, add: add, hos: hos, hos_emp: hos_emp, con: con, count: count})
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
                res.render('success-page', { title: 'Sucesso', success: 'Funcionário APAGADO com sucesso! Clique no botão abaixo para ser direcionado à página do(a) ' + hos.hos_name, page: '/Hospital/' + req.params.hosp_id + '/employee/sts/active'} );
            }).catch(err => {
                var erro = err.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            });
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
                            res.render('success-page', { title: 'Sucesso', success: 'Funcionário ATUALIZADO com sucesso! Clique no botão abaixo para ser direcionado à página do(a) ' + hos.hos_name, page: '/Hospital/' + req.params.hosp_id + '/employee/sts/active'} );
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
    })
}