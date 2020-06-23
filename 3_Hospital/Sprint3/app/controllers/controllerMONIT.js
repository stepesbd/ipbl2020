'use strict';
const moment = require('moment');
moment.locale('pt-BR');
const driver = require('bigchaindb-driver');
var requestAsync = require('async-request');
const BigchainDB = require( '../config/dbBigchainDB' );
const BigchainDB_API_PATH = 'http://' + BigchainDB.IP + ':9984/api/v1/';
const { Hospital } = require('../models/TS03');
const { Address } = require('../models/TS03');
const { RecordsCovidHome } = require('../models/TS03');
const HOST = require('../config/hostAPP').HOST;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
    MÉTODO GET
*/

exports.get = async (req, res, next) => {
    

    try{
        // BUSCANDO CONEXÃO COM MONGODB DA BLOCKCHAIN
        const bigchain = BigchainDB.getDb();

        // CASO NÃO HAJA ID DE MEDICAL RECORD, É PARA CARREGAR A LISTA DE ATENDIMENTOS SEM INTERNAÇÃO
        if(!req.params.id){
            
            const medRecs = await RecordsCovidHome.findAll();

            return res.render('patient-acompanhamento', { title: 'Acompanhamento de Pacientes', monitoring: true, medRec: medRecs } );
        }else{
            var isReset = req.params.id.toUpperCase();
            if(isReset == 'RESET'){

                if(req.params.action == '0'){
                    // ESTABELECENDO CONEXÃO COM API DA BIGCHAINDB
                    const conn = new driver.Connection(BigchainDB_API_PATH)

                    // ENCONTRAR OS REGISTROS MÉDICOS NA BLOCKCHAIN COM RESULTADO POSITIVO DE COVID-19
                    positiveCases = await conn.searchAssets('POSITIVO')
                    
                    return res.render('reset0', { title: 'RecoverCovidHome', recover: true, quantidade: positiveCases.length})
                }else if(req.params.action == '1'){
                    if(!auth_pwd_reset){
                        return res.render('erro-page', { title: 'Erro', erro: 'Falha na autenticação. Não será possível recuperar os dados. Clique abaixo para ir ao mapa de contágio.'} );
                    }else if(positiveCases.length == 0){
                        return res.render('erro-page', { title: 'Erro', erro: 'Houve um erro na recuperação dos dados de COVID-19 para pacientes não internados. Clique abaixo para ir ao mapa de contágio.'} );
                    }else{
                        // MAPEAR OS REGISTROS MÉDICOS PARA ENCONTRAR A UNSPENT TRANSFER DE CADA UM
                        await Promise.all(positiveCases.map(async positiveCase=>{
                            // ESTABELECENDO CONEXÃO COM API DA BIGCHAINDB
                            let conn = new driver.Connection(BigchainDB_API_PATH)
                            const userAllTransfers = await conn.listOutputs(positiveCase.data.Paciente.PublicKey, false)
                            let transferAsset = {Transfer: userAllTransfers[1], AssetId: positiveCase.id}
                            arrayOfTransfers.push(transferAsset)
                        }));
                        //return res.json(arrayOfTransfers);

                        return res.render('reset1', { title: 'RecoverCovidHome', recover: true})
                    }
                    
   
                }else if(req.params.action == '2'){
                    if(positiveCases.length == 0 || arrayOfTransfers.length == 0){
                        return res.render('erro-page', { title: 'Erro', erro: 'Houve um erro na recuperação dos dados de COVID-19 para pacientes não internados. Clique abaixo para ir ao mapa de contágio'} );
                    }else{
                        RecordsCovidHome.destroy({
                            where: {},
                            truncate: true
                        }).then(async ()=>{
                            // ARMAZENAMENTO DE OBJETOS
                            var arrayOfMedRec = [];

                            // MAPEAR AS UNSPENT TRANSFER DOS REGISTROS MÉDICOS COM CASOS POSITIVOS PARA IDENTIFICAR OS QUE NÃO FORAM INTERNADOS
                            await Promise.all(arrayOfTransfers.map(async transferAsset=>{
                                // ESTABELECENDO CONEXÃO COM API DA BIGCHAINDB TEMPORÁRIA
                                let conn_temp = new driver.Connection(BigchainDB_API_PATH)
                                const transaction = await conn_temp.getTransaction(transferAsset.Transfer.transaction_id)
                                if(!transaction.metadata.Causa_mortis){
                                    if(transaction.metadata.Type == 'PRELIMINARY-CARE'){
                                        let medRecord = await bigchain.collection('assets').findOne( {id: transferAsset.AssetId})
                                        arrayOfMedRec.push(medRecord);
                                        RecordsCovidHome.create({
                                            rec_paciente_id: medRecord.data.Paciente.Id,
                                            rec_name: medRecord.data.Paciente.Nome,
                                            rec_date: medRecord.data.Atendimento.Data_atendimento,
                                            rec_cpf: medRecord.data.Paciente.CPF,
                                            rec_medrec_id: medRecord.id
                                        })
                                    }
                                }
                            }));
                            positiveCases = {};
                            arrayOfTransfers = [];
                            auth_pwd_reset = false;
                            return res.render('reset2', { title: 'RecoverCovidHome', recover: true, quantidade: arrayOfMedRec.length})
                        });
                    }
                }
            }else{
                // OBJETO-RESPOSTA PARA REQUISIÇÃO À API
                var response = {}

                // ENCONTRAR O REGISTRO MÉDICO NA BLOCKCHAIN PARA DEPOIS ENCONTRAR A UNSPENT TRANSACTION
                const medicalRecord = await bigchain.collection('assets').findOne({ id: req.params.id });

                // IDENTIFICANDO O HOSPITAL E ENDEREÇO BANCO RELACIONAL
                const hos = await Hospital.findByPk(medicalRecord.data.Atendimento.Hospital.Id);
                const add = await Address.findOne({ 
                    include: [{
                        model: Hospital,
                        where: { add_id: hos.add_id },
                        required: true
                    }], 
                    raw: true 
                });
                const hospital = { hos, add }
                
                return res.render('medical_record', { title: 'Registro Médico', monitoring: true, hospital: hospital, att: medicalRecord.data, id: medicalRecord.id})
            }
             
        }
            
    }catch(err){
        console.log(err);
        var erro ='Ocorreu um erro: ' +  err.message;
        return res.render('erro-page', { title: 'Erro', erro: erro} );
    }
        

        
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
    MÉTODO POST
*/

exports.post = async (req, res, next) => {


    try{
        var type_of_request = req.params.id.toUpperCase();
        if(type_of_request == 'RESET'){
            if(req.body.inputPwd == 'stepesbd2020')
                auth_pwd_reset = true;
            return res.redirect('/monitoring/reset/1')
        }else{
            var action = '';
            if(req.params.action){
                // VERIFICANDO O TIPO DE AÇÃO NO REGISTRO MÉDICO FOI SOLICITADA
                action = req.params.action.toUpperCase();    
                if(action == 'DEATH'){
                    var causa_mortis = '';
                    // DEFININDO CAUSA MORTIS
                    if(req.body.inputCausaMortis == 'COVID-19')
                        causa_mortis = req.body.inputCausaMortis;
                    else
                        causa_mortis = req.body.inputCausaMortisText;
                    // CASO AÇÃO SEJA PARA DECLARAR ÓBITO DO PACIENTE QUE ESTÁ NO LEITO
                    var response = {}
                    // SOLICITAÇÃO NA API PARA DECLARAÇÃO DE ÓBITO
                    await requestAsync(HOST + "/api/records/" + req.params.id + '/death', {
                        method: 'POST',
                        data: { Causa_mortis: causa_mortis }
                    }).then((res)=>{
                        res = JSON.parse(res.body)
                        response = res;
                    }).catch(err=>{console.log(err)});
                    if(response.Error)
                        return res.render('erro-page', { title: 'Erro', erro: response.Error} );
                    else
                        return res.render('obito', { title: 'Declaração de Óbito', success: 'Realizada a Declaração de Óbito do paciente. Clique no botão abaixo para retornar à página de acompanhamento de casos COVID-19 sem internação.', obito: response, page: '/monitoring'} );
                }else if(action == 'RELEASE'){
                    // CASO A AÇÃO SEJA PARA DAR ALTA AO PACIENTE QUE ESTÁ NO LEITO
                    var response = {}
                    // SOLICITAÇÃO NA API PARA DECLARAÇÃO DE ALTA MÉDICA
                    await requestAsync(HOST + "/api/records/" + req.params.id + '/release', {
                        method: 'POST',
                    }).then((res)=>{
                        res = JSON.parse(res.body)
                        response = res;
                    }).catch(err=>{console.log(err)});
                    if(response.Error)
                        return res.render('erro-page', { title: 'Erro', erro: response.Error} );
                    else{
                        return res.render('success-page', { title: 'Alta Médica', success: 'Paciente recebeu Alta com sucesso! Clique no botão abaixo para retornar à página de acompanhamento de casos COVID-19 sem internação.', page: '/monitoring'} );
                    }
                }
            }else
                return res.render('erro-page', { title: 'Erro', erro: 'Solicitação com falta de parâmetros.'} );
        }
    }catch(err){
        console.log(err);
        var erro ='Ocorreu um erro: ' +  err.message;
        return res.render('erro-page', { title: 'Erro', erro: erro} );
    }

};

