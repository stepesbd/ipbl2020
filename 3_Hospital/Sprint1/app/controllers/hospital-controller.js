'use strict';
let request = require('async-request');
const driver = require('bigchaindb-driver');
const BigchainDB = require( '../config/dbBigchainDB' );
const BigchainDB_API_PATH = 'http://' + BigchainDB.IP + ':9984/api/v1/'
const { Address } = require('../models');
const { Hospital } = require('../models');
const { Employee } = require('../models');
const { Hospital_employee } = require('../models');
const { Medical_procedures } = require('../models');
const { Hosp_med_proc } = require('../models');
const { Contact } = require('../models');
const { Hospital_contact } = require('../models');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.post = async (req, res, next) => {

    try{
        var me = req.body;

        /*
            ORDEM DE EXECUÇÃO:
            CRIA ADDRESS >> CRIA HOSPITAL >> ASSOCIA HOSPITAL-PROCEDIMENTO
        */

        var cep = me.inputZipCode.toUpperCase();
        var lat = "";
        var lon = "";
        if (typeof cep === "number") {
            cep = cep.toString()
            cep = parseInt(cep.replace(/[^0-9]/g, ""))
        }
        cep = cep.replace(/-/gi, '');
        await request("https://www.cepaberto.com/api/v3/cep?cep=" + cep, {
            method: 'GET',
            headers: {'Authorization': 'Token token=787f1f666961d441fa85f9da7cd84f9d'},
        }).then((response)=>{
            response = JSON.parse(response.body)
            lat = response.latitude
            lon = response.longitude
        }).then(()=>{
            if(lat == undefined || lon == undefined)
                return res.render('erro-page', { title: 'Erro', erro: 'CEP inválido, tente novamente outro CEP.'} );
            Address.create({
                add_street: me.inputStreet.toUpperCase(),
                add_number: me.inputNumber,
                add_city: me.inputCity.toUpperCase(),
                add_state: me.inputState.toUpperCase(),
                add_country: me.inputCountry.toUpperCase(),
                add_zip_code: me.inputZipCode.toUpperCase(),
                add_latitude: lat.toString(),
                add_longitude: lon.toString(),
            }).then(function(add) {
                // INVALIDAÇÃO EM CASO DE CNPJ REPETIDO
                Hospital.findOne({
                    where: { hos_cnpj: me.inputCNPJ }
                }).then(function(hosCNPJrepeat){
                    if(hosCNPJrepeat == null){
                        // INVALIDAÇÃO EM CASO DE CNES REPETIDO
                        Hospital.findOne({
                            where: { hos_cnes_code: me.inputCNES }
                        }).then(function(hosCNESrepeat){
                            if(hosCNESrepeat == null){
                                 // BUSCANDO CONEXÃO COM MONGODB DA BLOCKCHAIN
                                const bigchain = BigchainDB.getDb();

                                // ESTABELECENDO CONEXÃO COM API DA BIGCHAINDB
                                const conn = new driver.Connection(BigchainDB_API_PATH)
                                // GERANDO CHAVES PARA O HOSPITAL 
                                const keys = new driver.Ed25519Keypair();

                                Hospital.create({
                                    hos_cnpj: me.inputCNPJ,
                                    hos_cnes_code: me.inputCNES,
                                    hos_name: me.inputNome.toUpperCase(),
                                    hos_corporate_name: me.inputCorporate.toUpperCase(),
                                    add_id: add.add_id,
                                    hos_publicKey: keys.publicKey,
                                    hos_privateKey: keys.privateKey
                                }).then(function(hos) {
                                    /*   
                                    ******** ASSOCIAÇÃO DE PROCEDIMENTOS ********
                                    */
                                    var arrayOfProcs = []
                                    var arrayOfValues = []
                    
                                    if(!Array.isArray(me.inputProcID)){
                                        arrayOfProcs.push(me.inputProcID);
                                    }else{
                                        arrayOfProcs = me.inputProcID;
                                    };
                                    if(!Array.isArray(me.inputValue)){
                                        arrayOfValues.push(me.inputValue);
                                    }else{
                                        arrayOfValues = me.inputValue;
                                    };
                    
                                    // CRIANDO A ASSOCIAÇÃO HOSPITAL-PROCEDIMENTO
                                    arrayOfProcs.forEach(function(proc){
                                        // CASO VALIDAÇÃO "REQUIRE" HTML FALHE E ENVIE VALOR VAZIO, NÃO SERÁ FEITA ASSOCIAÇÃO
                                        if(arrayOfValues[0] != null){
                                            hos.addMedical_procedures(proc,{
                                                through: {
                                                    hos_med_proc_value: arrayOfValues.shift()
                                                }
                                            })
                                        }
                                    })
                                    
                                    /*   
                                    ******** ASSOCIAÇÃO DE CONTATOS ********
                                    */
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
                                                    con.addHospital(hos);
                                                }).catch(err => {
                                                    con.destroy();
                                                    var erro = err.message;
                                                    res.render('erro-page', { title: 'Erro', erro: erro} );
                                                });  
                                            }
                                        })
                                    }
                                    res.render('success-page', { title: 'Sucesso', success: 'Hospital CRIADO com sucesso! Clique no botão abaixo para ser direcionado à lista de hospitais.', page: '/hospital'} );
                                }).catch(err => {
                                    add.destroy();       
                                    var erro = err.message;
                                    res.render('erro-page', { title: 'Erro', erro: erro} );
                                }); 
                
                            }else{
                                add.destroy();       
                                var erro = 'CNES já cadastrado!';
                                res.render('erro-page', { title: 'Erro', erro: erro} );
                            }
                        })
                    
                    }else{
                        add.destroy();       
                        var erro = 'CNPJ já cadastrado!';
                        res.render('erro-page', { title: 'Erro', erro: erro} );
                    }
    
                }).catch(err => {
                    add.destroy();       
                    var erro = err.message;
                    res.render('erro-page', { title: 'Erro', erro: erro} );
                }); 
                    
            }).catch(errHospCrea => {
                var erro ='Hospital não pode ser cadastrado, verifique a validade dos dados informados! ' +  errHospCrea.message;
                res.render('erro-page', { title: 'Erro', erro: erro} );
            })  
        })


    }catch(errHospCrea){
        var erro ='Hospital não pode ser cadastrado, verifique a validade dos dados informados! ' +  errHospCrea.message;
        res.render('erro-page', { title: 'Erro', erro: erro} );
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.get = (req, res, next) => {

    // CASO NÃO RECEBA O ID DO HOSPITAL PELO GET, LISTA TODOS OS USUÁRIOS - PÁGINA INICIAL DE HOSPITAIS 
    if(!req.params.id){
        Hospital.findAll({ order: [['hos_name', 'ASC']] }).then(function (hos) {
            Medical_procedures.findAll().then(function(med_proc){
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
                    res.render('hospital-lista', { title: 'Lista de Hospitais', hos: hos, med_proc: med_proc, hos_med_proc: hos_med_proc})
                })
            })
        })
    }else{
        // CASO RECEBA ID DO HOSPITAL, PÁGINA DE ATUALIZAÇÃO DO HOSPITAL
        Hospital.findOne(
            { where: {hos_id: req.params.id}},
        ).then(function (hos) {
            Address.findOne({ where: { add_id: hos.add_id } }).then(function (add) {
                Contact.findAll({
                    include: [{
                        model: Hospital_contact,
                        where: { hos_id: req.params.id }
                    }]
                }).then(function(con){
                    var count = 0;
                    con.forEach(function(con){
                        count = count + 1;
                    })
                    res.render('hospital-atualizacao', { title: 'Hospital', hos: hos, add: add, con: con, count: count})
                }).catch(err => {
                    var erro = err.message;
                    res.render('erro-page', { title: 'Erro', erro: erro} );
                });  
            })
        })
    }
};

///////////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////

exports.new = (req, res, next) => {
    
    // CASO MÉTODO NEW, PÁGINA DE CRIAÇÃO DE NOVO HOSPITAL
    Medical_procedures.findAll({ order: [['med_proc_id', 'ASC']] }).then(function(med_proc){
        res.render('hospital-cadastro', { title: 'Cadastro de Hospital', med_proc: med_proc })
    }).catch(err => {
        var erro = err.message;
        res.render('erro-page', { title: 'Erro', erro: erro} );
    }); 
        
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.update =  (req, res) => {
    var me = req.body;
    /* 'POST' */

    // RECEBE PARÂMETRO DE QUE HABILITA O UPDATE DE PROCEDIMENTOS MÉDICOS REALIZADOS PELO HOSPITAL.
    // ATRAVÉS DO BOTÃO DA PÁGINA INICIAL
    if(req.params.ProcsUpdate){
        Hospital.findByPk(req.params.id).then(function(hos){
            Hosp_med_proc.findAll({
                raw: true,
                where: { hos_id: req.params.id }
            }).then(function(hos_med_proc){
                // NECESSÁRIO PARA EVITAR BUG DE PROCEDIMENTO UNIÁRIO VINDO COMO STRING AO INVÉS DE ARRAY
                var arrayOfProcs = []
                var arrayOfValues = []
                
                if(!Array.isArray(me.inputProcID)){
                    arrayOfProcs.push(me.inputProcID);
                }else{
                    arrayOfProcs = me.inputProcID;
                };
                if(!Array.isArray(me.inputValue)){
                    arrayOfValues.push(me.inputValue);
                }else{
                    arrayOfValues = me.inputValue;
                };
                
                // REMOVENDO TODAS ASSOCIAÇÕES ANTERIORES
                hos.setMedical_procedures([]);
                
                // CRIANDO AS NOVAS ASSOCIAÇÕES
                arrayOfProcs.forEach(function(proc){
                    hos.addMedical_procedures(proc,{
                        through: {
                            hos_med_proc_value: arrayOfValues.shift()
                        }
                    })
                })
                res.redirect('/hospital');    
            })
        })
    }else{
        // CASO NÃO RECEBA O PARÂMETRO, SÃO DADOS 'POST' DE UPDATE DA PÁGINA INDIVIDUAL DE 
        // ATALIZAÇÃO DO HOSPITAL
        Hospital.findOne({ 
           where: {hos_id: req.params.id}
        }).then(async function (hos){
            var cep = me.inputZipCode.toUpperCase();
            var lat = "";
            var lon = "";
            if (typeof cep === "number") {
                cep = cep.toString()
                cep = parseInt(cep.replace(/[^0-9]/g, ""))
            }
            cep = cep.replace(/-/gi, '');
            await request("https://www.cepaberto.com/api/v3/cep?cep=" + cep, {
                method: 'GET',
                headers: {'Authorization': 'Token token=787f1f666961d441fa85f9da7cd84f9d'},
            }).then((response)=>{
                response = JSON.parse(response.body)
                lat = response.latitude
                lon = response.longitude
            }).then(()=>{
                if(lat == undefined || lon == undefined)
                        return res.render('erro-page', { title: 'Erro', erro: 'CEP inválido, tente novamente outro CEP.'} );
                Address.update({
                        add_street: me.inputStreet.toUpperCase(),
                        add_number: me.inputNumber,
                        add_city: me.inputCity.toUpperCase(),
                        add_state: me.inputState.toUpperCase(),
                        add_country: me.inputCountry.toUpperCase(),
                        add_zip_code: me.inputZipCode.toUpperCase(),
                        add_latitude: lat.toString(),
                        add_longitude: lon.toString(),
                    },{
                        returning: true, 
                        where: {add_id: hos.add_id} 
                    }).then(()=>{
                        // VERIFICANDO SE HÁ OUTRO HOSPITAL COM MESMO CNPJ - VALIDATION   
                        Hospital.findOne({
                            where: { hos_cnpj: me.inputCNPJ }
                        }).then(function(hosCNPJcheck){
                            if( (hosCNPJcheck == null) || (hosCNPJcheck.hos_cnpj.localeCompare(hos.hos_cnpj) === 0) ){
                                // VERIFICANDO SE HÁ OUTRO HOSPITAL COM MESMO CNES CODE - VALIDATION  
                                Hospital.findOne({
                                    where: { hos_cnes_code: me.inputCNES }
                                }).then(function(hosCNEScheck){
                                    if( (hosCNEScheck == null) || (hosCNEScheck.hos_cnes_code.localeCompare(hos.hos_cnes_code) === 0) ){
                                        Hospital.update({
                                            hos_cnpj: me.inputCNPJ,
                                            hos_cnes_code: me.inputCNES,
                                            hos_name: me.inputNome.toUpperCase(),
                                            hos_corporate_name: me.inputCorporate.toUpperCase(),
                                        },{
                                            returning: true, 
                                            where: {hos_id: req.params.id} 
                                        }).then(()=>{
                                            Contact.findAll({
                                                raw: true,
                                                include: [{
                                                    model: Hospital_contact,
                                                    where: { hos_id: req.params.id }
                                                }]
                                            }).then(function (old_contacs) {
                                                // REMOVENDO TODAS ASSOCIAÇÕES ANTERIORES
                                                old_contacs.forEach(function(old_con){
                                                    Contact.destroy({ where: { con_id: old_con.con_id } })
                                                });
                                                // NECESSÁRIO PARA EVITAR BUG DE PROCEDIMENTO UNIÁRIO VINDO COMO STRING AO INVÉS DE ARRAY
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
                                                            console.log(contactType)
                                                            
                                                            Contact.create({
                                                                con_type: contactType,
                                                                con_desc: arrayOfContactBox.shift(),
                                                            }).then(function(con){
                                                                con.addHospital(hos);
                                                            }).catch(err => {
                                                                con.destroy();
                                                                var erro = err.message;
                                                                res.render('erro-page', { title: 'Erro', erro: erro} );
                                                            });  
                                                        }
                                                    })
                                                }
                                                res.render('success-page', { title: 'Sucesso', success: 'Hospital ATUALIZADO com sucesso! Clique no botão abaixo para ser direcionado à lista de hospitais.', page: '/hospital'} );
                                            }).catch(err => {
                                                var erro = err.message;
                                                res.render('erro-page', { title: 'Erro', erro: erro} );
                                            }); 
                                        }).catch(err => {
                                            var erro = err.message;
                                            res.render('erro-page', { title: 'Erro', erro: erro} );
                                        }); 
                                    }else{
                                        var erro = 'Código CNES já cadastrado!';
                                        res.render('erro-page', { title: 'Erro', erro: erro} );
                                    }
                                })
                                
                            }else{
                                var erro = 'CNPJ já cadastrado!';
                                res.render('erro-page', { title: 'Erro', erro: erro} );
                            }
                        })
                    })    
            });           
        }).catch(err => {
            var erro = err.message;
            res.render('erro-page', { title: 'Erro', erro: erro} );
        }); 
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.delete = (req, res, next) => {

    // 1 - PARA DELETAR HOSPITAL PRIMEIRO ACHA O ID
    Hospital.findByPk(req.params.id).then(function(hos){
        // 2 - DELETAR OS REGISTROS DE CONTATOS DO HOSPITAL 
        Contact.findAll({
            raw: true,
            include: [{
                model: Hospital_contact,
                where: { hos_id: hos.hos_id }
            }]
        }).then(function(con_hos){
            // 3 - DELETAR OS REGISTROS DE CONTATOS DO HOSPITAL 
            for(var i = 0 ; i < con_hos.length ; i++){
                Contact.destroy({where: {con_id: con_hos[i].con_id}});
            }
            // 4 - ENCONTRAR OS REGISTROS DOS CONTATOS FUNCIONÁRIOS DESTE HOSPITAL
            Contact.findAll({
                raw: true,
                include: [{
                    model: Employee,
                    include: [{
                        model: Hospital_employee,
                        where: { hos_id: hos.hos_id },
                    }],
                    required: true             
                }],
            }).then(function(con_emp){
                // 5 - DELETAR OS REGISTROS DOS CONTATOS DOS FUNCIONÁRIOS DESTE HOSPITAL
                for(var i = 0 ; i < con_emp.length ; i++){
                    Contact.destroy({where: {con_id: con_emp[i].con_id}});
                }
                // 6 - ENCONTRAR TODOS OS FUNCIONÁRIOS DESTE HOSPITAL
                Employee.findAll({
                    raw: true,
                    include: [{
                        model: Hospital_employee,
                        where: { hos_id: hos.hos_id }
                    }]
                }).then(function(emp){
                    // 7 - DELETAR OS REGISTROS DOS FUNCIONÁRIOS DESTE HOSPITAL COM  OS SEUS ENDEREÇOS CADASTRADOS
                    for(var i = 0 ; i < emp.length ; i++){
                            Address.destroy({where: {add_id: emp[i].add_id}});
                            Employee.destroy({where: {emp_id: emp[i].emp_id}});
                    }
                    // 8 - DELETAR O ENDEREÇO DO HOSPITAL
                    Address.destroy({
                        where: { add_id: hos.add_id }
                    }).then(() => {
                        // 9 - DELETAR O HOSPITAL
                        Hospital.destroy({ 
                            where: { hos_id: req.params.id }
                        }).then(() => {
                            // 10 - REDIRECIONA PÁGINA
                            res.render('success-page', { title: 'Sucesso', success: 'Hospital APAGADO com sucesso! Clique no botão abaixo para ser direcionado à lista de hospitais.', page: '/hospital'} );
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
        }).catch(err => {
            var erro = err.message;
            res.render('erro-page', { title: 'Erro', erro: erro} );
        });
    }).catch(err => {
        var erro = err.message;
        res.render('erro-page', { title: 'Erro', erro: erro} );
    });
}

/*
console.log(req.body)
console.log('type of req.body: %s', typeof req.body)
console.log('type of req.body.arrayOfProcs: %s', typeof arrayOfProcs)
console.log('is req.body.arrayOfProcs an array?: %s', Array.isArray(arrayOfProcs))
console.log('type of first array element: %s', typeof arrayOfProcs[0])

console.log(arrayOfProcs)
console.log(arrayOfValues)
*/