'use strict';
const mongoose = require("mongoose")
require("../../models/MongoDB/Hospital")
const Hospital = mongoose.model("Hospital")
require("../../models/MongoDB/Address")
const Address = mongoose.model("Address")
require("../../models/MongoDB/Contact")
const Contact = mongoose.model("Contact")
require("../../models/MongoDB/Employee")
const Employee = mongoose.model("Employee")
require("../../models/MongoDB/Medical_procedure")
const Medical_procedure = mongoose.model("Medical_procedure")
require("../../models/MongoDB/Hosp_emp")
const Hosp_emp = mongoose.model("Hosp_emp")
require("../../models/MongoDB/Hosp_med_proc")
const Hosp_med_proc = mongoose.model("Hosp_med_proc")
const validation = require('../validation');

exports.get = async (req, res, next) => {

    try{
        // CASO NÃO RECEBA O ID DO HOSPITAL PELO GET, LISTA TODOS OS USUÁRIOS - PÁGINA INICIAL DE HOSPITAIS 
        if(!req.params.id){
            const hos = await Hospital.find();
            const med_proc = await Medical_procedure.find();
            const hosp_med_proc = await Hosp_med_proc.find().populate(["hospital", "medical_procedure"]);
            res.render('_hospital-lista', { title: 'Lista de Hospitais', hos: hos, med_proc: med_proc, hosp_med_proc: hosp_med_proc })
        }else{
            // CASO RECEBA ID DO HOSPITAL, PÁGINA DE ATUALIZAÇÃO DO HOSPITAL
            Hospital.findById(req.params.id).populate(["address", "contact"]).then((hos)=>{
                var count = 0;
                hos.contact.forEach(()=>{
                    count = count + 1;
                })
                res.render('_hospital-atualizacao', { title: 'Hospital', hos: hos, add: hos.address, con: hos.contact, count: count})
            })
        }
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao carregar a página.");
        return res.redirect('/');
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.post = async (req, res, next) => {
    try{
        
        // VALIDAÇÃO DOS DADOS ENVIADOS PELO FORMULÁRIO
        var erros = validation.validHospital(req.body);

        // VERIFICA CNPJ JÁ CADASTRADO
        const hosCheckCNPJ = await Hospital.findOne({ hos_cnpj: req.body.inputCNPJ });
        if(hosCheckCNPJ)
            erros.push({texto: "CNPJ já cadastrado."})

        // VERIFICA CNES JÁ CADASTRADO
        const hosCheckCNES = await Hospital.findOne({ hos_cnes_code: req.body.inputCNES });
        if(hosCheckCNES)
            erros.push({texto: "CNES já cadastrado."})

        if(erros.length > 0){
            const med_proc = await Medical_procedure.find();
            res.render("_hospital-cadastro", {title: "Cadastro de Hospital" , erros: erros, values: req.body, med_proc: med_proc})
        }else{
            
            // CRIANDO HOSPITAL
            const novoHospital = await Hospital.create({
                hos_cnpj: req.body.inputCNPJ,
                hos_cnes_code: req.body.inputCNES,
                hos_name: req.body.inputNome.toUpperCase(),
                hos_corporate_name: req.body.inputCorporate.toUpperCase(),
            });

            // CRIANDO ENDEREÇO DO HOSPITAL
            const novoAddress = await Address.create({
                add_street: req.body.inputStreet.toUpperCase(),
                add_number: req.body.inputNumber,
                add_city: req.body.inputCity.toUpperCase(),
                add_state: req.body.inputState.toUpperCase(),
                add_country: req.body.inputCountry.toUpperCase(),
                add_zip_code: req.body.inputZipCode.toUpperCase(),
                hospital: novoHospital._id   // ASSOCIAÇÃO ADDRESS-HOSPITAL 
            });

            novoHospital.address = novoAddress._id; // ASSOCIAÇÃO HOSPITAL-ADDRESS

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
                        hospital: novoHospital._id
                    });
                    
                    // ASSOCIANDO CONTACT-HOSPITAL
                    await novoContact.save();

                    novoHospital.contact.push(novoContact);
                }
            }));

            // VERIFICANDO ARRAY DE PROCEDIMENTOS ATRIBUÍDOS
            var arrayOfProcs = []
            var arrayOfValues = []

            if(!Array.isArray(req.body.inputProcID)){
                arrayOfProcs.push(req.body.inputProcID);
            }else{
                arrayOfProcs = req.body.inputProcID;
            };
            if(!Array.isArray(req.body.inputValue)){
                arrayOfValues.push(req.body.inputValue);
            }else{
                arrayOfValues = req.body.inputValue;
            };

            // ATRIBUINDO PROCEDIMENTOS
            await Promise.all(arrayOfProcs.map(async proc_ID => {
                const med_proc = await Medical_procedure.findById(proc_ID);
                if(arrayOfValues[0] != null){
                    const novoHosp_med_proc = new Hosp_med_proc({
                        hosp_med_proc_value: arrayOfValues.shift(),
                        medical_procedure: proc_ID,
                        hospital: novoHospital._id
                    });

                    // ASSOCIANDO HOSP_MED_PROC-MED_PROC
                    med_proc.hosp_med_proc.push(novoHosp_med_proc);
                    await med_proc.save();

                    // ASSOCIANDO HOSP_MED_PROC-HOSPITAL
                    novoHospital.hosp_med_proc.push(novoHosp_med_proc);
                    await novoHosp_med_proc.save();
                }
            }));

            // ASSOCIANDO HOSPITAL-CONTACT
            novoHospital.hos_keypair.privateKey = '';
            novoHospital.hos_keypair.publicKey = '';
            await novoHospital.save();
            
            req.flash("success_msg", "Hospital cadastrado com sucesso.")
            res.redirect('/MongoDB/hospital')
        }
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao tentar cadastrar o Hospital");
        return res.redirect('/MongoDB/hospital');
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.new = async (req, res, next) => {
    try{
        const med_proc = await Medical_procedure.find();
        res.render('_hospital-cadastro', { title: 'Cadastro de Hospital', med_proc: med_proc})
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao tentar carregar página de Cadastro de Hospital");
        return res.redirect('/MongoDB/hospital');
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.update = async (req, res, next) => {
    try{
        // RECEBE PARÂMETRO DE QUE HABILITA O UPDATE DE PROCEDIMENTOS MÉDICOS REALIZADOS PELO HOSPITAL.
        // ATRAVÉS DO BOTÃO DA PÁGINA INICIAL
        if(req.params.ProcsUpdate){
            const hos = await Hospital.findById(req.params.id);

            // EXCLUINDO ARRAY DE HOSP_MED_PROC ASSOCIADOS ANTERIORMENTE
            await Hosp_med_proc.deleteMany({ hospital: hos._id });

            // VERIFICANDO ARRAY DE PROCEDIMENTOS NOVOS ATRIBUÍDOS
            var arrayOfProcs = []
            var arrayOfValues = []

            if(!Array.isArray(req.body.inputProcID)){
                arrayOfProcs.push(req.body.inputProcID);
            }else{
                arrayOfProcs = req.body.inputProcID;
            };
            if(!Array.isArray(req.body.inputValue)){
                arrayOfValues.push(req.body.inputValue);
            }else{
                arrayOfValues = req.body.inputValue;
            };

            // ATRIBUINDO PROCEDIMENTOS
            await Promise.all(arrayOfProcs.map(async proc_ID => {
                const med_proc = await Medical_procedure.findById(proc_ID);
                if(arrayOfValues[0] != null){
                    const novoHosp_med_proc = new Hosp_med_proc({
                        hosp_med_proc_value: arrayOfValues.shift(),
                        medical_procedure: proc_ID,
                        hospital: hos._id
                    });

                    // ASSOCIANDO HOSP_MED_PROC-MED_PROC
                    med_proc.hosp_med_proc.push(novoHosp_med_proc);
                    await med_proc.save();

                    // ASSOCIANDO HOSP_MED_PROC-HOSPITAL
                    hos.hosp_med_proc.push(novoHosp_med_proc);
                    await novoHosp_med_proc.save();
                }
            }));

            await hos.save();

            req.flash("success_msg", "Procedimentos médicos do Hospital atualizados com sucesso.")
            res.redirect('/MongoDB/hospital')

        }else{
        // CASO NÃO RECEBA O PARÂMETRO, SÃO DADOS 'POST' DE UPDATE DA PÁGINA INDIVIDUAL DE 
        // ATALIZAÇÃO DO HOSPITAL
            
            const hos = await Hospital.findById(req.params.id);
            const hosCheckCNPJ = await Hospital.findOne({ hos_cnpj: req.body.inputCNPJ });
            const hosCheckCNES = await Hospital.findOne({ hos_cnes_code: req.body.inputCNES });

            // VALIDAÇÃO DOS DADOS ENVIADOS PELO FORMULÁRIO
            var erros = validation.validHospital(req.body);

            // VERIFICA CNPJ JÁ CADASTRADO
            if(hosCheckCNPJ && !hosCheckCNPJ.equals(hos))
                erros.push({texto: "CNPJ já cadastrado."})

            // VERIFICA CNES JÁ CADASTRADO
            console.log(hosCheckCNES)
            if(hosCheckCNES && !hosCheckCNES.equals(hos))
                erros.push({texto: "CNES já cadastrado."})

            if(erros.length > 0){
                Hospital.findById(req.params.id).populate(["address", "contact"]).then((hos)=>{
                    res.render("_hospital-atualizacao", {title: "Hospital" , erros: erros, hos: hos, add: hos.address, con: hos.contact})
                })
            }else{
                // ATUALIZANDO O HOSPITAL...
                const atualHospital = await Hospital.findByIdAndUpdate(req.params.id, {
                    hos_cnpj: req.body.inputCNPJ,
                    hos_cnes_code: req.body.inputCNES,
                    hos_name: req.body.inputNome.toUpperCase(),
                    hos_corporate_name: req.body.inputCorporate.toUpperCase(),
                }, { new: true });

                // ATUALIZANDO ENDEREÇO DO HOSPITAL...
                await Address.findOneAndUpdate({ hospital: atualHospital._id },{
                    add_street: req.body.inputStreet.toUpperCase(),
                    add_number: req.body.inputNumber,
                    add_city: req.body.inputCity.toUpperCase(),
                    add_state: req.body.inputState.toUpperCase(),
                    add_country: req.body.inputCountry.toUpperCase(),
                    add_zip_code: req.body.inputZipCode.toUpperCase(),
                }, { new: true });

                // ARRAY DE CONTATOS RECEBIDOS DO FORMULÁRIO
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
                atualHospital.contact = [];
                await Contact.deleteMany({ hospital: atualHospital._id })

                // ATRIBUINDO NOVAMENTE ARRAY DE CONTATOS 
                await Promise.all(arrayOfContactTypes.map(async contactType => {
                    if(arrayOfContactBox[0].length > 0){
                            const novoContact = new Contact({
                                con_type: contactType,
                                con_desc: arrayOfContactBox.shift(),
                                hospital: atualHospital._id
                            });
                        await novoContact.save();
        
                        atualHospital.contact.push(novoContact);
                    }
                }));
                
                // ASSOCIANDO HOSPITAL-CONTACT
                await atualHospital.save();
    
                req.flash("success_msg", "Hospital atualizado com sucesso.")
                res.redirect('/MongoDB/hospital')
            }
        }
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao tentar atualizar o hospital");
        return res.redirect('/MongoDB/hospital');
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.delete = async (req, res, next) => {

    try{
        const hospitalDel = await Hospital.findOneAndRemove({ _id: req.params.id});
        const hosp_emps = await Hosp_emp.find({ hospital: hospitalDel._id }).populate("employee");

        // APAGANDO TUDO RELATIVO AOS FUNCIONÁRIOS ASSOCIADOS AO HOSPITAL-OBJETO
        await Promise.all(hosp_emps.map(async (hosp_emp)=>{
            // ENCONTRA O ENDEREÇO ASSOCIADO AO EMPLOYEE-OBJETO E DELETA
            await Address.deleteOne({ employee: hosp_emp.employee._id });

            // ENCONTRA OS CONTATOS ASSOCIADOS AO EMPLOYEE-OBJETO E DELETA
            await Contact.deleteMany({ employee: hosp_emp.employee._id });

            // ENCONTRA OS FUNCIONÁRIOS ASSOCIADOS AO HOSPITAL-OBJETO E DELETA
            await Employee.deleteOne({ _id: hosp_emp.employee._id });
        }));

        // ENCONTRA OS ENDEREÇOS ASSOCIADOS AO HOSPITAL-OBJETO E DELETA
        await Address.deleteOne({ hospital: hospitalDel._id });

        // ENCONTRA OS CONTATOS  ASSOCIADOS AO HOSPITAL-OBJETO E DELETA
        await Contact.deleteMany({ hospital: hospitalDel._id });

        // ENCONTRA AS RELAÇÕES HOSP_MED_PROC ASSOCIADOS AO HOSPITAL-OBJETO E DELETA
        await Hosp_med_proc.deleteMany({ hospital: hospitalDel._id });

        // ENCONTRA AS RELAÇÕES HOSP_EMP ASSOCIADOS AO EMPLOYEE-OBJETO E DELETA
        await Hosp_emp.deleteMany({ hospital: hospitalDel._id });
        
        req.flash("success_msg", "Hospital apagado com sucesso.");
        res.redirect('/MongoDB/hospital');
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao tentar apagar o hospital");
        return res.redirect('/MongoDB/hospital');
    }
};