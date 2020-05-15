'use strict';
const moment = require('moment');
const mongoose = require("mongoose")
require("../../models/MongoDB/Hospital")
const Hospital = mongoose.model("Hospital")
require("../../models/MongoDB/Address")
const Address = mongoose.model("Address")
require("../../models/MongoDB/Contact")
const Contact = mongoose.model("Contact")
require("../../models/MongoDB/Employee")
const Employee = mongoose.model("Employee")
require("../../models/MongoDB/Hosp_emp")
const Hosp_emp = mongoose.model("Hosp_emp")
const validation = require('../validation');

exports.get = async (req, res, next) => {

    try{
        const hos = await Hospital.findById(req.params.hosp_id);

        if(!req.params.employee_id){
            /************ LISTA DE FUNCIONÁRIOS **************/
    
            if(req.params.sts == 'active'){    
                 const hosp_emp = await Hosp_emp.find({
                     hospital: hos._id,
                     hos_emp_demission_date: { $eq : null }  // FUNCIONÁRIO ATIVO
                 }).populate("employee");
                res.render('_funcionario-lista', { title: 'Lista de Funcionários', hos: hos, hosp_emp: hosp_emp, active: 'active', inactive: ''} );
            }else{
                const hosp_emp = await Hosp_emp.find({
                    hospital: hos._id,
                    hos_emp_demission_date: { $gte : new Date("01/01/1000 00:00") } // FUNCIONÁRIO INATIVO
                }).populate("employee");
                res.render('_funcionario-lista', { title: 'Lista de Funcionários', hos: hos, hosp_emp: hosp_emp, active: '', inactive: 'active'} );
            }
        }else{
            /************ ATUALIZAÇÃO DE FUNCIONÁRIO **************/
            const emp = await Employee.findById(req.params.employee_id).populate(["address", "contact"]);
            const hosp_emp = await Hosp_emp.findOne({ employee: emp._id, hospital: hos._id });
            var count = 0;
            emp.contact.forEach(()=>{
                count = count + 1;
            })
            res.render('_funcionario-atualizacao', { title: 'Funcionário', hos: hos, emp: emp, add: emp.address, con: emp.contact, hosp_emp: hosp_emp, count: count})
        }
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao carregar a página do Funcionário.");
        return res.redirect('/MongoDB/hospital');
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



exports.post = async (req, res, next) => {

    try{
        const hos = await Hospital.findById(req.params.hosp_id);
        
        // VALIDAÇÃO DOS DADOS ENVIADOS PELO FORMULÁRIO
        var erros = validation.validEmployee(req.body);

        // VERIFICA CNS JÁ CADASTRADO
        const empCheckCNS = await Employee.findOne({ emp_cns_code: req.body.inputCNS });
        if(empCheckCNS)
            erros.push({texto: "CNS já cadastrado."})
        
        if(erros.length > 0){
            res.render("_funcionario-cadastro", {title: "Cadastro de Funcionário", erros: erros, hos: hos, values: req.body})
        }else{

            // CRIANDO O FUNCIONÁRIO
            const novoEmployee = await Employee.create({
                emp_name : req.body.inputNome.toUpperCase(),
                emp_cns_code: req.body.inputCNS,
                emp_occupation : req.body.inputFuncao.toUpperCase(),
                //hospital: hos._id
            });

            // CRIANDO ENDEREÇO DO FUNCIONÁRIO
            const novoAddress = await Address.create({
                add_street: req.body.inputStreet.toUpperCase(),
                add_number: req.body.inputNumber,
                add_city: req.body.inputCity.toUpperCase(),
                add_state: req.body.inputState.toUpperCase(),
                add_country: req.body.inputCountry.toUpperCase(),
                add_zip_code: req.body.inputZipCode.toUpperCase(),
                employee: novoEmployee._id   // ASSOCIAÇÃO ADDRESS-EMPLOYEE 
            });
            
            novoEmployee.address = novoAddress._id; // ASSOCIAÇÃO EMPLOYEE-ADDRESS
            
            // CRIANDO NOVA RELAÇÃO FUNCIONÁRIO-HOSPITAL
            const novoHosp_emp = await Hosp_emp.create({
                hos_emp_admission_date: req.body.inputAdmi,
                hos_emp_demission_date: req.body.inputDemiss,
                hos_emp_salary: req.body.inputSalary,
                hospital: hos._id,
                employee: novoEmployee._id
            });

            novoEmployee.hosp_emp = novoHosp_emp._id; // ASSOCIAÇÃO EMPLOYEE-HOSP_EMP
            hos.hosp_emp.push(novoHosp_emp._id); // ASSOCIAÇÃO HOSPITAL-HOSP_EMP
            await hos.save();
            

            // VERIFICANDO ARRAY DE CONTATOS CADASTRADOS
            if(req.body.inputContactBox[0] != null){
                var arrayOfContactTypes = []
                var arrayOfContactBox = []

                if(!Array.isArray(req.body.inputContactType)){
                    arrayOfContactTypes.push(req.body.inputContactType);
                }else{
                    arrayOfContactTypes = req.body.inputContactType;
                };
                if(!Array.isArray(req.body.inputContactBox)){
                    arrayOfContactBox.push(req.body.inputContactBox);
                }else{
                    arrayOfContactBox = req.body.inputContactBox;
                };
            }
            
            // ATRIBUINDO CONTATOS
            await Promise.all(arrayOfContactTypes.map(async contactType => {

                if(arrayOfContactBox[0].length > 0){
                    const novoContact = new Contact({
                        con_type: contactType,
                        con_desc: arrayOfContactBox.shift(),
                        employee: novoEmployee._id
                    });
                    // ASSOCIANDO CONTACT-EMPLOYEE
                    await novoContact.save();

                    novoEmployee.contact.push(novoContact);
                }
            }));

            // ASSOCIANDO EMPLOYEE-CONTACT
            await novoEmployee.save();
            await novoEmployee.save();

            req.flash("success_msg", "Funcionário cadastrado com sucesso.")
            res.redirect('/MongoDB/hospital/' + req.params.hosp_id + '/employee/sts/active');
        }

    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao tentar cadastar Funcionário.");
        return res.redirect('/MongoDB/hospital/' + req.params.hosp_id + '/employee/sts/active');
    }
            
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


exports.new = async (req, res, next) => {

    try{
        const hos = await Hospital.findById(req.params.hosp_id);
        res.render('_funcionario-cadastro', { title: 'Cadastro de Funcionário', hos: hos }); 
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao carregar a página de Cadastro de Funcionários.");
        return res.redirect('/MongoDB/hospital/'+ req.params.hosp_id + '/employee/sts/active');
    }

};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.update = async (req, res, next) => {
    try{
        const hos = await Hospital.findById(req.params.hosp_id);
        const emp = await Employee.findById(req.params.employee_id);
        const hosp_emp = await Hosp_emp.findOne({ employee: emp._id, hospital: hos._id });

        // VALIDAÇÃO DOS DADOS ENVIADOS PELO FORMULÁRIO
        var erros = validation.validEmployee(req.body);

        // VERIFICA CNS JÁ CADASTRADO
        const empCheckCNS = await Employee.findOne({ emp_cns_code: req.body.inputCNS });
        if(empCheckCNS && !empCheckCNS.equals(emp))
            erros.push({texto: "CNS já cadastrado."})

        if(erros.length > 0){
            const emp = await Employee.findById(req.params.employee_id).populate(["address", "contact"]);
            const hosp_emp = await Hosp_emp.findOne({ employee: emp._id, hospital: hos._id });
            var count = 0;
            emp.contact.forEach(()=>{
                count = count + 1;
            })
            res.render('_funcionario-atualizacao', { title: 'Funcionário', erros: erros, hos: hos, emp: emp, add: emp.address, con: emp.contact, hosp_emp: hosp_emp, count: count})
        }else{

            // ATUALIZANDO O FUNCIONÁRIO
            const atualEmployee = await Employee.findByIdAndUpdate(req.params.employee_id, {
                emp_name : req.body.inputNome.toUpperCase(),
                emp_cns_code: req.body.inputCNS,
                emp_occupation : req.body.inputFuncao.toUpperCase(),
            }, { new: true });

            // ATUALIZANDO AS RELAÇÕES HOSP_EMP
            hosp_emp.hos_emp_admission_date = req.body.inputAdmi;
            hosp_emp.hos_emp_demission_date = req.body.inputDemiss;
            hosp_emp.hos_emp_salary = req.body.inputSalary;
            await hosp_emp.save();

            // ATUALIZANDO ENDEREÇO DO FUNCIONÁRIO
            await Address.findOneAndUpdate({ employee: atualEmployee._id },{
                add_street: req.body.inputStreet.toUpperCase(),
                add_number: req.body.inputNumber,
                add_city: req.body.inputCity.toUpperCase(),
                add_state: req.body.inputState.toUpperCase(),
                add_country: req.body.inputCountry.toUpperCase(),
                add_zip_code: req.body.inputZipCode.toUpperCase(),
            }, { new: true });

            // VERIFICANDO ARRAY DE CONTATOS CADASTRADOS
            if(req.body.inputContactBox[0] != null){
                var arrayOfContactTypes = []
                var arrayOfContactBox = []

                if(!Array.isArray(req.body.inputContactType)){
                    arrayOfContactTypes.push(req.body.inputContactType);
                }else{
                    arrayOfContactTypes = req.body.inputContactType;
                };
                if(!Array.isArray(req.body.inputContactBox)){
                    arrayOfContactBox.push(req.body.inputContactBox);
                }else{
                    arrayOfContactBox = req.body.inputContactBox;
                };
            }
            
            // EXCLUINDO ARRAY DE CONTATOS ANTERIORES
            atualEmployee.contact = [];
            await Contact.deleteMany({ employee: atualEmployee._id })

            // ATRIBUINDO NOVAMENTE ARRAY DE CONTATOS 
            await Promise.all(arrayOfContactTypes.map(async contactType => {

                if(arrayOfContactBox[0].length > 0){
                    const novoContact = new Contact({
                        con_type: contactType,
                        con_desc: arrayOfContactBox.shift(),
                        employee: atualEmployee._id
                    });
                    // ASSOCIANDO CONTACT-EMPLOYEE
                    await novoContact.save();

                    atualEmployee.contact.push(novoContact);
                }
            }));

            // ASSOCIANDO EMPLOYEE-CONTACT
            await atualEmployee.save();

            req.flash("success_msg", "Funcionário atualizado com sucesso.")
            res.redirect('/MongoDB/hospital/' + req.params.hosp_id + '/employee/sts/active');
        }
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao tentar atualizar Funcionário.");
        return res.redirect('/MongoDB/hospital/'+ req.params.hosp_id + '/employee/sts/active');
    }
        
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.delete = async (req, res, next) => {

    try{
        // ENCONTRA O EMPLOYEE-OBJETO
        const employeeDel = await Employee.findOneAndRemove({ _id: req.params.employee_id});

        // ENCONTRA O ENDEREÇO ASSOCIADO AO EMPLOYEE-OBJETO E DELETA
        await Address.deleteOne({ employee: employeeDel._id });

        // ENCONTRA OS CONTATOS ASSOCIADOS AO EMPLOYEE-OBJETO E DELETA
        await Contact.deleteMany({ employee: employeeDel._id });

        // ENCONTRA AS RELAÇÕES HOSP_EMP ASSOCIADOS AO EMPLOYEE-OBJETO E DELETA
        await Hosp_emp.deleteMany({ employee: employeeDel._id });

        req.flash("success_msg", "Funcionário apagado com sucesso.");
        res.redirect('/MongoDB/hospital/' + req.params.hosp_id + '/employee/sts/active');
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao tentar apagar o Funcionário");
        return res.redirect('/MongoDB/hospital/' + req.params.hosp_id + '/employee/sts/active');
    }
    
};