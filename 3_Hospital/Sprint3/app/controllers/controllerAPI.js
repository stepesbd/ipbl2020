'use strict';
var request = require('request');
const moment = require('moment');
moment.locale('pt-BR');
const driver = require('bigchaindb-driver');
const sequelize = require('sequelize');
const BigchainDB = require( '../config/dbBigchainDB' );
const BigchainDB_API_PATH = 'http://' + BigchainDB.IP + ':9984/api/v1/'
const { Bed } = require('../models/TS03');
const { Hospital } = require('../models/TS03');
const { Address } = require('../models/TS03');
const { RecordsCovidHome } = require('../models/TS03');
const date_base = require('../config/dbBigchainDB').date_base;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
    MÉTODO GET
*/

exports.get = async (req, res, next) => {

    try{
        // BUSCANDO CONEXÃO COM MONGODB DA BLOCKCHAIN
        const bigchain = BigchainDB.getDb();

        // ESTABELECENDO CONEXÃO COM API DA BIGCHAINDB
        const conn = new driver.Connection(BigchainDB_API_PATH)

        // CASO NÃO TENHA PARÂMETROS DE TIPO DE REQUISIÇÃO DA API, CARREGA PÁGINA DE DOCUMENTAÇÃO
        if(!req.params.type){
            return res.json({
                'TIME_SCRUM': '03 - Hospital',
                'Paginas': ['https://stepesbdhospital.herokuapp.com/',
                            'https://stepesbdrecursos.herokuapp.com/',
                            'https://stepesbdmedrecords.herokuapp.com/',],
                'API': {
                    'Casos_positivos_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/positive',
                    'Numero_de_casos_positivos_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/positive/amount',
                    'Casos_positivos_COVID-19_tratamento_em_casa': 'https://stepesbdmedrecords.herokuapp.com/api/covid-home',
                    'Numero_de_casos_positivos_COVID-19_tratamento_em_casa': 'https://stepesbdmedrecords.herokuapp.com/api/covid-home-amount',
                    'Casos_recuperados_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/release',
                    'Numero_de_casos_recuperados_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/release/amount',
                    'Casos_obitos_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/death',
                    'Numero_de_casos_obitos_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/death/amount',
                    'Lista_de_hospitais': 'https://stepesbdhospital.herokuapp.com/api/hosp-list',
                    'Numero_de_leitos_disponiveis': 'https://stepesbdhospital.herokuapp.com/api/bed-unoccupied',
                    'Numero_de_leitos_disponiveis': 'https://stepesbdhospital.herokuapp.com/api/bed-occupied',
                    'Geracao_de_chaves_blockchain': 'https://stepesbdmedrecords.herokuapp.com/api/keypair',
                    'Comunicacao_de_obitos': ' http://stepesbd.ddns.net:5000/patient/api',
                    'Contagem_de_obitos': 'http://stepesbd.ddns.net:5000/dashboard/api/obitos/covid',
                    'Simulacao_de_atendimento': 'http://stepesbd.ddns.net:5000/simulation/api/attendance'
                },
                'Versao': '1.0'
            })
        }else{
            var API_type = req.params.type.toUpperCase();
            // BUSCAR APENAS UM REGISTRO MÉDICO NA BASE DE DADOS
            if(API_type == 'RECORDS'){
                if(req.params.id1){
                    // OBJETO-RESPOSTA PARA REQUISIÇÃO À API
                    var response = {}

                    // ENCONTRAR O REGISTRO MÉDICO NA BLOCKCHAIN PARA DEPOIS ENCONTRAR A UNSPENT TRANSACTION
                    const medicalRecord = await bigchain.collection('assets').findOne({ id: req.params.id1 });

                    // CASO NÃO HAJA OPÇÃO DEFINIDA, APENAS EXIBE O REGISTRO MÉDICO 
                    // CONFIGURANDO O OBJETO-RESPOSTA
                    response = {MedicalRecord: medicalRecord.data, Id: medicalRecord.id} 

                    // ENVIA COMO RESPONSE
                    return res.json(response)
                    
                }else
                    return res.json({Erro: 'Erro ao carregar a página: Registro médico não encontrado!'});
            }else if(API_type == 'POSITIVE'){
                // BUSCAR CASOS POSITIVOS DE COVID-19
                var API_id1;
                var positiveCases;
                if(req.params.id1)
                    API_id1 = req.params.id1.toUpperCase();
                if(API_id1 == 'AMOUNT')
                    positiveCases = await bigchain.collection('assets').find( {'data.Atendimento.Hospital.Exame_covid.Resultado': 'POSITIVO'}).count()
                else
                    positiveCases = await bigchain.collection('assets').find( {'data.Atendimento.Hospital.Exame_covid.Resultado': 'POSITIVO'}).project({'data.Atendimento.Hospital.Exame_covid':true}).toArray()
                return res.json(positiveCases);
            }else if(API_type == 'RELEASE'){
                // BUSCAR CASOS DE RECUPERADOS DE COVID-19
                var API_id1;
                var releaseList;
                if(req.params.id1)
                    API_id1 = req.params.id1.toUpperCase();
                if(API_id1 == 'AMOUNT')
                    releaseList = await bigchain.collection('metadata').find( {'metadata.Type': 'COVID-19-RELEASE'}).count()
                else
                    releaseList = await bigchain.collection('metadata').find( {'metadata.Type': 'COVID-19-RELEASE'}).project({'metadata':true}).toArray()
                return res.json(releaseList);
            }else if(API_type == 'DEATH'){
                 // BUSCAR CASOS DE RECUPERADOS DE COVID-19
                 var API_id1;
                 var releaseList;
                 if(req.params.id1)
                     API_id1 = req.params.id1.toUpperCase();
                 if(API_id1 == 'AMOUNT')
                     releaseList = await bigchain.collection('metadata').find( {'metadata.Causa_mortis': 'COVID-19'}).count()
                 else
                     releaseList = await bigchain.collection('metadata').find( {'metadata.Causa_mortis': 'COVID-19'}).project({'metadata':true}).toArray()
                 return res.json(releaseList);
            }else if(API_type == 'KEYPAIR'){
                // FORNECER NOVAS CHAVES PUBLICKEY E PRIVATEKEY PELA API
                const keys = new driver.Ed25519Keypair();
                return res.json({
                    'PublicKey': keys.publicKey,
                    'PrivateKey': keys.privateKey
                });
            }else if(API_type == 'COVID-HOME-AMOUNT'){
                const medRecs = await RecordsCovidHome.findAll({raw: true, attributes: [[sequelize.fn('COUNT', sequelize.col('rec_id')), 'qty_cases_at_home']]});
                return res.json(medRecs[0].qty_cases_at_home);
            }else if(API_type == 'COVID-HOME'){
                const medRecs = await RecordsCovidHome.findAll({raw: true});
                return res.json(medRecs);
            }
                
        }  
            
    }catch(err){
        console.log(err);
        return res.json({Erro: 'Erro ao carregar a página!'});
    }

};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
    MÉTODO POST
*/

exports.post = async (req, res, next) => {

    try{
        // BUSCANDO CONEXÃO COM MONGODB DA BLOCKCHAIN
        const bigchain = BigchainDB.getDb();
        var paciente_id;
        // ESTABELECENDO CONEXÃO COM API DA BIGCHAINDB
        const conn = new driver.Connection(BigchainDB_API_PATH)
        var API_request = '';
        if(req.params.type)
            API_request = req.params.type.toUpperCase();
        if(API_request == 'RECORDS'){
            if(req.params.id1){
                // OBJETO-RESPOSTA PARA REQUISIÇÃO À API
                var response = {}

                // ENCONTRAR O REGISTRO MÉDICO NA BLOCKCHAIN PARA DEPOIS ENCONTRAR A UNSPENT TRANSACTION
                const medicalRecord = await bigchain.collection('assets').findOne({ id: req.params.id1 });
                
                if(medicalRecord.data.Paciente.Id)
                    paciente_id = medicalRecord.data.Paciente.Id;
                else
                    paciente_id = 1
                // BUSCAR TODOS ATENDIMENTOS DO PACIENTE
                const userAllTransfers = await conn.listOutputs(medicalRecord.data.Paciente.PublicKey, false)

                // MAPEAR TODAS OS ATENDIMENTOS E FILTRAR PELO ID BUSCADO
                var transferOwnerPaciente = {};
                await Promise.all(userAllTransfers.map(async transfer=>{
                    const transaction = await conn.getTransaction(transfer.transaction_id)
                    if(transaction.asset.id == medicalRecord.id){
                        transferOwnerPaciente = transaction;
                    }
                }));
                var type_of_request = '';
                if(req.params.id2)
                    type_of_request = req.params.id2.toUpperCase();

                
                // VERIFICANDO O TIPO DE SOLICITAÇÃO PARA O REGISTRO MÉDICO PELA API
                if(type_of_request == 'RELEASE'){
                    // CASO ESCOLHA OPÇÃO ALTA MÉDICA
                    var metadata = {}
                    if(medicalRecord.data.Atendimento.Hospital.Exame_covid){
                        if(medicalRecord.data.Atendimento.Hospital.Exame_covid.Resultado == 'POSITIVO'){
                            metadata = {
                                'Type': 'COVID-19-RELEASE',
                                'Paciente': medicalRecord.data.Paciente.Id,
                                'Latitude': medicalRecord.data.Atendimento.Hospital.Exame_covid.Latitude,
                                'Longitude': medicalRecord.data.Atendimento.Hospital.Exame_covid.Longitude,
                                //'Data' : moment(new Date()).format('L'),
                                //'Unix_time': parseInt((new Date().getTime() / 1000).toFixed(0)).toString()
                                'Release_Date': moment(new Date()).subtract(date_base, 'days').format('L'),
                                'Unix_time': parseInt((new Date().getTime() / 1000).toFixed(0)) - (86400 * date_base)
                            }
                        }else{
                            metadata = {
                                'Type': 'RELEASE',
                                'Paciente': medicalRecord.data.Paciente.Id,
                                //'Data' : moment(new Date()).format('L'),
                                //'Unix_time': parseInt((new Date().getTime() / 1000).toFixed(0)).toString()
                                'Data': moment(new Date()).subtract(date_base, 'days').format('L'),
                                'Unix_time': parseInt((new Date().getTime() / 1000).toFixed(0)) - (86400 * date_base)
                            }
                        }
                    }else{
                        metadata = {
                            'Type': 'RELEASE',
                            'Paciente': medicalRecord.data.Paciente.Id,
                            //'Data' : moment(new Date()).format('L'),
                            //'Unix_time': parseInt((new Date().getTime() / 1000).toFixed(0)).toString()
                            'Data': moment(new Date()).subtract(date_base, 'days').format('L'),
                            'Unix_time': parseInt((new Date().getTime() / 1000).toFixed(0)) - (86400 * date_base)
                        }
                    }

                    // CRIAÇÃO DA TRANSACTION DO PACIENTE PARA ELE PRÓPRIO COM NOVAS INFORMAÇÕES DE PRONTUÁRIO
                    const txTransferRelease = driver.Transaction.makeTransferTransaction(
                            [{ tx: transferOwnerPaciente, output_index: 0 }],
                            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(medicalRecord.data.Paciente.PublicKey))],
                            metadata
                    )

                    // ASSINATURA DO PACIENTE
                    let txTransferReleaseSigned = driver.Transaction.signTransaction(txTransferRelease, medicalRecord.data.Paciente.PrivateKey)

                    // TRANSMISSÃO DE DADOS PARA BLOCKCHAIN
                    conn.postTransactionAsync(txTransferReleaseSigned).then(()=>{
                        if(medicalRecord.data.Atendimento.Hospital.Internacao){
                            // ATUALIZAÇÃO DO LEITO HOSPITALAR
                            Bed.update(
                                {
                                    bed_medical_record: '',
                                    bed_status: 0   // LIBERA LEITO
                                },
                                {where: {bed_id: medicalRecord.data.Atendimento.Hospital.Internacao.Leito_id}}
                            )
                        }else{
                            // APAGA REGISTRO DO BANCO RELACIONAL RecordsCovidHome PARA PACIENTES COM COVID-19 QUE NÃO FORAM INTERNADOS
                            RecordsCovidHome.destroy({where: { rec_medrec_id: req.params.id1 }})
                            .then(()=>{console.log('Registro de RecordsCovidHome apagado.')})
                            .catch(err=>{
                                console.log("Erro ao apagar registro de RecordsCovidHome."); 
                                console.log(err);
                            })
                        }
                        console.log('Registro de Alta Médica feito com sucesso: ', txTransferReleaseSigned.id)   
                        const responseMetadata = {Release: txTransferReleaseSigned.metadata}
                        // CONFIGURANDO O OBJETO-RESPOSTA
                        response = {medicalRecord, responseMetadata} 
                        // ENVIA COMO RESPONSE
                        return res.json(response) 
                    }).catch((err)=>{
                        console.log(err)
                        return res.json({Erro: 'Erro ao realizar Transaction!'});
                    })
                }else if(type_of_request == 'DEATH'){
                    // CASO ESCOLHA OPÇÃO ÓBITO
                    var causa_mortis = req.body.Causa_mortis;      // MUDAR PARA DAR OPÇÃO ANTES DE ENVIAR O POST
                    var metadata = {};
                    // METADATA RECEBENDO INFORMAÇÕES DE CAUSA-MORTIS
                    if(causa_mortis == 'COVID-19'){
                        // CASO SEJA MORTE POR COVID-19
                        metadata = {
                            'Type': 'COVID-19-DEATH',
                            'Causa_mortis': causa_mortis,
                            'Nome': medicalRecord.data.Paciente.Nome,
                            'Latitude': medicalRecord.data.Atendimento.Hospital.Exame_covid.Latitude,
                            'Longitude': medicalRecord.data.Atendimento.Hospital.Exame_covid.Longitude,
                            //'Data' : moment(new Date()).format('LLL'),
                            //'Unix_time': parseInt((new Date().getTime() / 1000).toFixed(0)).toString()
                            'Data': moment(new Date()).subtract(date_base, 'days').format('LLL'),
                            'Unix_time': parseInt((new Date().getTime() / 1000).toFixed(0)) - (86400 * date_base)
                        }
                    }else{
                        // CASO NÃO SEJA MORTE POR COVID-19
                        metadata = { 
                            'Type': 'DEATH',
                            'Causa_mortis': causa_mortis,
                            //'Data' : moment(new Date()).format('LLL'),
                            //'Unix_time': parseInt((new Date().getTime() / 1000).toFixed(0)).toString()
                            'Data': moment(new Date()).subtract(date_base, 'days').format('LLL'),
                            'Unix_time': parseInt((new Date().getTime() / 1000).toFixed(0)) - (86400 * date_base)
                        }
                    }
                    
                    // CRIAÇÃO DA TRANSACTION DO PACIENTE PARA ELE PRÓPRIO COM NOVAS INFORMAÇÕES DE PRONTUÁRIO
                    const txTransferRelease = driver.Transaction.makeTransferTransaction(
                            [{ tx: transferOwnerPaciente, output_index: 0 }],
                            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(medicalRecord.data.Paciente.PublicKey))],
                            metadata
                    )

                    // ASSINATURA DO PACIENTE
                    let txTransferReleaseSigned = driver.Transaction.signTransaction(txTransferRelease, medicalRecord.data.Paciente.PrivateKey)
                    console.log('Registro de Óbito feito com sucesso: ', txTransferReleaseSigned.id)
                    
                    // TRANSMISSÃO DE DADOS PARA BLOCKCHAIN
                    conn.postTransactionAsync(txTransferReleaseSigned).then(async ()=>{
                        if(medicalRecord.data.Atendimento.Hospital.Internacao){
                            // ATUALIZAÇÃO DO LEITO HOSPITALAR
                            Bed.update(
                                {
                                    bed_medical_record: '',
                                    bed_status: 0   // LIBERA LEITO
                                },
                                {where: {bed_id: medicalRecord.data.Atendimento.Hospital.Internacao.Leito_id}}
                            ) 
                        }else{
                            // APAGA REGISTRO DO BANCO RELACIONAL RecordsCovidHome PARA PACIENTES COM COVID-19 QUE NÃO FORAM INTERNADOS
                            RecordsCovidHome.destroy({where: { rec_medrec_id: req.params.id1 }})
                            .then(()=>{console.log('Registro de RecordsCovidHome apagado.')})
                            .catch(err=>{
                                console.log("Erro ao apagar registro de RecordsCovidHome."); 
                                console.log(err);
                            })
                        }
                        
                        // ENVIANDO DADOS PARA TIME PACIENTES REALIZAR ATUALIZAÇÃO DE FALECIMENTO
                        const id = paciente_id.toString();
                        //const data_obito = parseInt((new Date().getTime() / 1000).toFixed(0)).toString();
                        const data_obito = parseInt((new Date().getTime() / 1000).toFixed(0)) - (86400 * date_base)
                        const message = {
                            "id": id,
                            "causa_mortis": causa_mortis,
                            "data_obito": data_obito,
                            "certidao_obito_id": txTransferReleaseSigned.id
                        }
                        request({
                            url: "http://stepesbd.ddns.net:5000/patient/api/kill",
                            method: "PUT",
                            json: true,   // <--Very important!!!
                            body: message
                        }, function (error, response, body){if(error)throw error; /*console.log(body); console.log(message)*/ });

                        const responseMetadata = {Death: txTransferReleaseSigned.metadata}
                        const MedicalRecord = medicalRecord.data
                        const record_id = txTransferReleaseSigned.id
                        // CONFIGURANDO O OBJETO-RESPOSTA
                        response = {record_id, MedicalRecord, responseMetadata} 
                        // ENVIA COMO RESPONSE
                        return res.json(response) 
                    }).catch((err)=>{
                        console.log(err)
                        return res.json({Erro: 'Erro ao realizar Transaction!'});
                    })
                }
            }else
                return res.json({Erro: 'Erro ao carregar a página: Registro médico não encontrado!'});
        }

    }catch(err){
        console.log(err);
        var erro ='Ocorreu um erro: ' +  err.message;
        return res.render('erro-page', { title: 'Erro', erro: erro} );
    }

};



/*
// CRIANDO INDEX PARA QUERIES TEXTUAIS
        bigchain.collection('transactions').createIndex( { name: "text", description: "text" } )
        const transaction = await bigchain.collection('transactions').findOne( { id: req.params.id} )
*/