'use strict';
let request = require('async-request');
const moment = require('moment');
moment.locale('pt-BR');
const driver = require('bigchaindb-driver');
const BigchainDB = require( '../config/dbBigchainDB' );
const BigchainDB_API_PATH = 'http://35.198.33.211:9984/api/v1/'
const { Bed } = require('../models/TS03');
const { Hospital } = require('../models/TS03');
const { Address } = require('../models/TS03');


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

        var API_request = '';
        if(req.params.type)
            API_request = req.params.type.toUpperCase();
        if(API_request == 'RECORDS'){
            if(req.params.id1){
                // OBJETO-RESPOSTA PARA REQUISIÇÃO À API
                var response = {}

                // ENCONTRAR O REGISTRO MÉDICO NA BLOCKCHAIN PARA DEPOIS ENCONTRAR A UNSPENT TRANSACTION
                const medicalRecord = await await bigchain.collection('assets').findOne({ id: req.params.id1 });

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

                // CASO NÃO HAJA OPÇÃO DEFINIDA, APENAS EXIBE O REGISTRO MÉDICO 
                // CONFIGURANDO O OBJETO-RESPOSTA
                response = {MedicalRecord: medicalRecord.data} 

                // ENVIA COMO RESPONSE
                return res.json(response)
                
            }else
                return res.json({Erro: 'Erro ao carregar a página: Registro médico não encontrado!'});
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
                const medicalRecord = await await bigchain.collection('assets').findOne({ id: req.params.id1 });

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

                    // CRIAÇÃO DA TRANSACTION DO PACIENTE PARA ELE PRÓPRIO COM NOVAS INFORMAÇÕES DE PRONTUÁRIO
                    const txTransferRelease = driver.Transaction.makeTransferTransaction(
                            [{ tx: transferOwnerPaciente, output_index: 0 }],
                            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(medicalRecord.data.Paciente.PublicKey))],
                            { 'Release_date': moment(new Date()).format('LLL') }
                    )

                    // ASSINATURA DO PACIENTE
                    let txTransferReleaseSigned = driver.Transaction.signTransaction(txTransferRelease, medicalRecord.data.Paciente.PrivateKey)
                    console.log('Registro de Alta Médica feito com sucesso: ', txTransferReleaseSigned.id)

                    // TRANSMISSÃO DE DADOS PARA BLOCKCHAIN
                    conn.postTransactionAsync(txTransferReleaseSigned).then(()=>{
                        // ATUALIZAÇÃO DO LEITO HOSPITALAR
                        Bed.update(
                            {
                                bed_medical_record: '',
                                bed_status: 0   // LIBERA LEITO
                            },
                            {where: {bed_id: medicalRecord.data.Atendimento.Hospital.Internacao.Leito_id}}
                        )
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
                    // METADATA RECEBENDO INFORMAÇÕES DE CAUSA-MORTIS
                    if(causa_mortis == 'COVID-19'){
                        // CASO SEJA MORTE POR COVID-19
                        var metadata = {
                            'Causa_mortis': causa_mortis,
                            'COVID-19': {
                                'Status': 'DEAD',
                                'Paciente_name': medicalRecord.data.Paciente.Nome,
                                'Paciente_CEP': medicalRecord.data.Paciente.Endereco.CEP
                            },
                            'Death_date': moment(new Date()).format('LLL')
                        }
                    }else{
                        // CASO NÃO SEJA MORTE POR COVID-19
                        var metadata = { 
                            'Causa_mortis': causa_mortis,
                            'Death_date': moment(new Date()).format('LLL')
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
                    conn.postTransactionAsync(txTransferReleaseSigned).then(()=>{
                        // ATUALIZAÇÃO DO LEITO HOSPITALAR
                        Bed.update(
                            {
                                bed_medical_record: '',
                                bed_status: 0   // LIBERA LEITO
                            },
                            {where: {bed_id: medicalRecord.data.Atendimento.Hospital.Internacao.Leito_id}}
                        )
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
                }else{
                    return res.json({Erro: 'Solicitação com falta de parâmetros.'});
                }
            }else
                return res.json({Erro: 'Erro ao carregar a página: Registro médico não encontrado!'});
        }

    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao carregar a página.");
        return res.redirect('/');
    }

};



/*
// CRIANDO INDEX PARA QUERIES TEXTUAIS
        bigchain.collection('transactions').createIndex( { name: "text", description: "text" } )
        const transaction = await bigchain.collection('transactions').findOne( { id: req.params.id} )
*/