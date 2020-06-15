'use strict';
const fs = require("fs")
const fsPromise = require('fs').promises;
let request = require('async-request');
const sequelize = require('sequelize');
const driver = require('bigchaindb-driver');
const moment = require('moment');
moment.locale('pt-BR');
const BigchainDB = require( '../config/dbBigchainDB' );
const BigchainDB_API_PATH = 'http://' + BigchainDB.IP + ':9984/api/v1/'
const { Hospital } = require('../models/TS03');
const { Address } = require('../models/TS03');
const { Bed } = require('../models/TS03');
const { Bed_sector } = require('../models/TS03');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
    MÉTODO GET
*/

exports.get = async (req, res, next) => {

    try{
        // CASO NÃO RECEBA DADOS VIA POST
        if(attObj.Atendimento != null){
            var type_of_page = '';
            if(req.params.step)
            type_of_page = req.params.step.toUpperCase()
            // STEP 1: ESCOLHA DO HOSPITAL
            if(type_of_page == 'STEP1'){
                const add = await Address.findAll({ 
                    include: [{
                        model: Hospital,
                        required: true
                    }], 
                    raw: true 
                });
                var objSTR = JSON.stringify(add)
                var re = /Hospitals./gi;
                var newObjstr = objSTR.replace(re, '');
                const obj = JSON.parse(newObjstr)

                return res.render('step1', { title: 'Atendimento Presencial', hos: obj, att: attObj})
            }

            // STEP 2: DECISÃO SOBRE INTERNAÇÃO
            if(type_of_page == 'STEP2'){
                // ADICIONANDO HOSPITAL NO ATENDIMENTO (ESCOLHA DO STEP 1)
                attObj.Atendimento = { ...attObj.Atendimento,  
                    // ADICIONANDO LEITO DE INTERNAÇÃO NO JSON ATENDIMENTO (ESCOLHA DO STEP 2)
                Data_atendimento: moment(new Date()).format('L'),
                Hospital: {
                    Id: req.body.inputHosID, 
                    Nome: req.body.inputHosName
                    } 
                }

            // IDENTIFICANDO O HOSPITAL NO BANCO RELACIONAL
            const hos = await Hospital.findByPk(attObj.Atendimento.Hospital.Id);  

            // CONTABILIZANDO O NÚMERO DE UTI'S
            const UTI = await Bed.findAll({  
                attributes: [[sequelize.fn('COUNT', sequelize.col('bed_id')), 'qty']],
                raw: true,              
                include: [{
                    model: Bed_sector,
                    where: { id: 1 },
                    attributes: [],
                    required: true,                                             
                }],
                where: {
                    hos_id: hos.hos_id, 
                    bed_status: 0       // LEITO LIVRE
                }
            })
            const uti = UTI[0];
            // CONTABILIZANDO O NÚMERO DE AMBULARÓRIOS
            const AMBULATORIO = await Bed.findAll({  
                attributes: [[sequelize.fn('COUNT', sequelize.col('bed_id')), 'qty']],
                raw: true,              
                include: [{
                    model: Bed_sector,
                    where: { id: 2 },
                    attributes: [],
                    required: true,                                             
                }],
                where: {
                    hos_id: hos.hos_id, 
                    bed_status: 0       // LEITO LIVRE
                }
            })
            const ambulatorio = AMBULATORIO[0];
            // CONTABILIZANDO O NÚMERO TOTAL DE LEITOS
            const all = {qty: (uti.qty + ambulatorio.qty) }
            // ENCAPSULANDO TUDO EM UM OBJETO
            const beds = {uti, ambulatorio, all}


            return res.render('step2', { title: 'Atendimento Presencial', att: attObj, beds: beds})
        }

            // STEP 3: ESCOLHA DOS ITENS DESCARTÁVEIS
            if(type_of_page == 'STEP3'){

                // IDENTIFICANDO O HOSPITAL NO BANCO RELACIONAL
                const hos = await Hospital.findByPk(attObj.Atendimento.Hospital.Id);  

                if(req.body.inputInternacaoYES){
                    // DESIGNANDO O LEITO PARA INTERNAÇÃO
                    const bed = await Bed.findOne({  
                        raw: true,              
                        include: [{
                            model: Bed_sector,
                            where: { sector_desc: req.body.radioLeitos },
                            required: true                                                
                        }],
                        where: {
                            hos_id: hos.hos_id, 
                            bed_status: 0       // LEITO LIVRE
                        }
                    })
                    var bedSTR = JSON.stringify(bed)
                    var re1 = /sector_desc/gi;
                    var newBedSTR = bedSTR.replace(re1, 'desc');
                    var re2 = /Bed_sector./gi;
                    newBedSTR = newBedSTR.replace(re2, 'sector_');
                    const bedOBJ = JSON.parse(newBedSTR)

                    // ADICIONANDO LEITO DE INTERNAÇÃO NO JSON ATENDIMENTO (ESCOLHA DO STEP 2)
                    attObj.Atendimento.Hospital = { ...attObj.Atendimento.Hospital, 
                        Internacao: { 
                            Leito_id: bedOBJ.bed_id,
                            Leito_nome: bedOBJ.bed_name,
                            Tipo: bedOBJ.sector_desc
                        } 
                    }
                }

                // BUSCANDO CONEXÃO COM MONGODB DA BLOCKCHAIN
                const bigchain = BigchainDB.getDb();

                // ESTABELECENDO CONEXÃO COM API DA BIGCHAINDB
                const conn = new driver.Connection(BigchainDB_API_PATH)

                // LISTA DE ARRAYS PARA ARMAZENAR INFORMAÇÕES PASSADAS PARA FRONT-END
                const userAssets = [];
                const assetsIDRepeat = []

                // REALIZA CONSULTAS APENAS SE O HOSPITAL TIVER FEITO PELO MENOS UM MATERIAL
                if(hos.hos_publicKey){
                    // BUSCAR TODAS AS UNSPENT-TRANSFER DO HOSPITAL
                    const userAllTransfers = await conn.listOutputs(hos.hos_publicKey, false)
                    // OBTER O ID DO ASSET DE CADA UMA DELAS
                    await Promise.all(userAllTransfers.map(async transfer=>{
                        const transaction = await conn.getTransaction(transfer.transaction_id)
                        assetsIDRepeat.push(transaction.asset.id)
                    }));
                    // EXCLUIR LISTA OS ASSETS DUPLICADOS: DEVIDO À MAIS DDE UMA UNSPENT-TRANSFER NO MESMO ASSET
                    var arrayOfAssetsID = await assetsIDRepeat.filter(function(elem, index, self) {
                        return index === self.indexOf(elem);
                    })

                    // EXECUTAR OS PASSOS ABAIXO PARA CADA ASSET DA LISTA ANTERIOR
                    await Promise.all(arrayOfAssetsID.map(async asset_id => {
                        // ENCONTRA ASSET NA BLOCKCHAIN PELO SEU ID
                        const asset = await bigchain.collection('assets').findOne({ id: asset_id });
                    
                        // EMPILHANDO O HISTÓRICO
                        userAssets.push(asset);
                    }));
                }
                return res.render('step3', { title: 'Atendimento Presencial', hos: hos, asset: userAssets, att: attObj })
            }

            // STEP 3: ESCOLHA DOS ITENS DESCARTÁVEIS
            if(type_of_page == 'STEP4'){
                
                // ADICIONANDO LEITO DE INTERNAÇÃO NO JSON ATENDIMENTO (ESCOLHA DO STEP 2)
                attObj.Atendimento.Hospital = { ...attObj.Atendimento.Hospital, 
                    Itens_consumidos: []
                }
                // IDENTIFICANDO O HOSPITAL NO BANCO RELACIONAL
                const hos = await Hospital.findByPk(attObj.Atendimento.Hospital.Id);  

                // IDENTIFICANDO O ENDEREÇO DO HOSPITAL NO BANCO RELACIONAL
                const add = await Address.findOne({ 
                    include: [{
                        model: Hospital,
                        where: { add_id: hos.add_id },
                        required: true
                    }], 
                    raw: true 
                });
                const hospital = { hos, add }

                // BUSCANDO CONEXÃO COM MONGODB DA BLOCKCHAIN
                const bigchain = BigchainDB.getDb();

                // ESTABELECENDO CONEXÃO COM API DA BIGCHAINDB
                const conn = new driver.Connection(BigchainDB_API_PATH)

                
                var arrayAssetsConsumidos = [];

                if(req.body.inputAsset != null){
                    var arrayOfAssetsID = []
                    
                    if(!Array.isArray(req.body.inputAsset)){
                        arrayOfAssetsID.push(req.body.inputAsset);
                    }else{
                        arrayOfAssetsID = req.body.inputAsset;
                    };

                    // IDENTIFICANDO AS CHAVES DE ASSINATURA DO COMPRADOR E VENDEDOR
                    const paciente_publicKey = attObj.Paciente.PublicKey
                    const paciente_privateKey = attObj.Paciente.PrivateKey
                    const hospital_publicKey = hos.hos_publicKey
                    const hospital_privateKey = hos.hos_privateKey
                    
                    await Promise.all(arrayOfAssetsID.map(async assetID=>{
                        // BUSCAR TODAS AS UNSPENT-TRANSFER DO HOSPITAL
                        const UnspentTransfersRepeat = await conn.listOutputs(hospital_publicKey, false)

                        // ARMAZENANDO TODAS AS TRANSACTIONS
                        var arrayTransaction = []
                        // ARMAZENA A PARTIR DO SEU ID
                        await Promise.all(UnspentTransfersRepeat.map(async unspentTransfer=>{
                            const transaction = await conn.getTransaction(unspentTransfer.transaction_id)
                            arrayTransaction.push(transaction)
                        }));
                        // ELIMINA ASSETS DUPLICADOS DA LISTA
                        arrayTransaction = arrayTransaction.filter((elem, index, self) => self.findIndex((t) => {
                            return (t.asset.id === elem.asset.id)}) === index)
                        
                        // A PARTIR DA LISTA FORMADA, EFETUAR AS TRANSAÇÕES
                        await Promise.all(arrayTransaction.map(async unspentTransfer=>{
                            // IDENTIFICANDO A TRANSACTION MAPEADA
                            const transactionUsed = await conn.getTransaction(unspentTransfer.id)
                            
                            // COMPARA O ID DA TRANSACTION COM O ITEM UTILIZADO NA BLOCKCHAIN
                            if(transactionUsed.asset.id == assetID){
                                // VERIFICANDO SE É UM TESTE DE COVID-19
                                const AssetCheckTestCovid = await await bigchain.collection('assets').findOne({ id: assetID });
                                var metadata = {};
                                if(AssetCheckTestCovid.data.Product.Description.toUpperCase().includes("COVID")){
                                    // GERANDO RESULTADO RANDÔMICO PARA TESTE COVID
                                    var result = Math.random() >= 0.1;
                                    var result_test = '';
                                    // CASO TESTE POSITIVO
                                    if(result){
                                        result_test = 'POSITIVO';
                                        // BUSCAR LAT LONG DO PACIENTE INFECTADO PARA CONSTAR NO ATENDIMENTO
                                        var cep = attObj.Paciente.Endereco.CEP;
                                        var lat = "";
                                        var lon = "";
                                        if (typeof cep === "number") {
                                            cep = cep.toString()
                                            cep = parseInt(cep.replace(/[^0-9]/g, ""))
                                        }
                                        cep = cep.replace(/-/gi, '');
                                        // CONSULTA NA API DO CEP-ABERTO
                                        await request("https://www.cepaberto.com/api/v3/cep?cep=" + cep, {
                                            method: 'GET',
                                            headers: {'Authorization': 'Token token=787f1f666961d441fa85f9da7cd84f9d'},
                                        }).then((response)=>{
                                            response = JSON.parse(response.body)
                                            lat = response.latitude
                                            lon = response.longitude
                                        });
                                        // ACRESCENTANDO INFORMAÇÃO DE EXAME NO ATENDIMENTO PARA CASOS POSITIVOS DE COVID
                                        attObj.Atendimento.Hospital = { ...attObj.Atendimento.Hospital, 
                                            Exame_covid: {
                                                Paciente: attObj.Paciente.Id, 
                                                Resultado: result_test,
                                                Latitude: lat,
                                                Longitude: lon,
                                                Data: moment(new Date()).format('L'),
                                                Unix_time: parseInt((new Date().getTime() / 1000).toFixed(0))
                                            }
                                        }
                                        metadata = {
                                            'COVID-19': {
                                                'Test': result_test,
                                                'Status': 'POSITIVO'
                                            },
                                            'Transaction_date': new Date(),
                                        }
                                    }else{
                                        // CASO TESTE NEGATIVO
                                        result_test = 'NEGATIVO';
                                        // ACRESCENTANDO INFORMAÇÃO DE EXAME NO ATENDIMENTO PARA CASOS NEGATIVOS DE COVID
                                        attObj.Atendimento.Hospital = { ...attObj.Atendimento.Hospital, 
                                            Exame_covid: {
                                                Resultado: result_test,
                                            }
                                        }
                                        metadata = {
                                            'COVID-19': {
                                                'Test': result_test,
                                                'Status': 'NEGATIVO'
                                            },
                                            'Transaction_date': new Date(),
                                        }
                                    }
                                }else{
                                    // ADICIONANDO METADATA PARA TRANSACTION CREATE DO ATENDIMENTO SEM USO DE TESTE DE COVID
                                    metadata = {
                                            'Transaction_date': new Date()
                                    }
                                }

                                // ITENS QUE COMPORÃO O ARRAY DO ATENDIMENTO
                                const assetConsumido = {
                                    Asset_id: "",
                                    Transaction_id: "",
                                    Name: "",
                                }
                                assetConsumido.Asset_id = assetID;
                                assetConsumido.Name = AssetCheckTestCovid.data.Product.Description.toUpperCase();

                                // DESCOBRINDO A QUANTIDADE E O INDEX DO OUTPUT NA UNPENT-TRANSACTION DO ITEM À VENDA
                                var remainQuantity = '';
                                var outputIndex = 0
                                var inputQty_ = '1';
                                await Promise.all(transactionUsed.outputs.map(async output => {
                                    if(output.public_keys[0] == hospital_publicKey){
                                        remainQuantity = parseInt(output.amount) - parseInt(inputQty_)    // quantidade usada é 1
                                    }
                                }))

                                console.log("Remain quantity: " + remainQuantity)
                                if(remainQuantity >= 0){
                                    
                                    // DEFININDO OS OUTPUTS DA TRANSAÇÃO A PARTIR DA QUANTIDADE COMPRADA
                                    var outputs = []
                                    if(remainQuantity == 0){
                                        // CASO USE ULTIMO ITEM DO HOSPITAL
                                        outputs = [ driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(paciente_publicKey), inputQty_)]
                                    }else if(remainQuantity > 0){
                                        // CASO AINDA RESTEM OUTROS ITENS NO ESTOQUE DO HOSPITAL
                                        outputs = [ driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(hospital_publicKey), remainQuantity.toString()),
                                                    driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(paciente_publicKey), inputQty_)]
                                    }
                                    
                                    // TRANSFERÊNCIA DO ASSET
                                    const txTransferAsset = await driver.Transaction.makeTransferTransaction(
                                        // INPUT -> ORIGEM DO ASSET
                                        [ { tx: transactionUsed, output_index: outputIndex } ],
                                        // OUTPUT -> DESTINO(S) DO ASSET
                                        outputs,
                                        // TRANSFER METADATA
                                        metadata
                                    )

                                    // ASSINATURA DO VENDEDOR PARA TRANSAÇÃO
                                    let txTransferAssetSigned = driver.Transaction.signTransaction(txTransferAsset, hospital_privateKey)
                                    
                                    // PREENCHENDO ARRAY DO ATENDIMENTO
                                    assetConsumido.Transaction_id = txTransferAssetSigned.id;
                                    // EMPILHA NO ARRAY DO ATENDIMENTO
                                    arrayAssetsConsumidos.push(assetConsumido);
                                    // ADICIONANDO LEITO DE INTERNAÇÃO NO JSON ATENDIMENTO (ESCOLHA DO STEP 2)
                                    attObj.Atendimento.Hospital.Itens_consumidos.push(assetConsumido);

                                    // POST COM UM COMMIT, ENTÃO A TRANSAÇÃO É VALIDADE E INSERIDA EM UM BLOCO
                                    conn.postTransactionAsync(txTransferAssetSigned).then(async ()=>{
                                        // MENSAGEM DE SUCESSO NO CONSOLE
                                        console.log('Transação de item do Hospital para Paciente realizada com sucesso: ' + txTransferAssetSigned.id)
                                        
                                    }).catch((err)=>{
                                        console.log(err);
                                        var erro ='Ocorreu um erro: ' +  err.message;
                                        return res.render('erro-page', { title: 'Erro', erro: erro} );
                                    })

                                }
                                
                            }
                        }));
                    }));
                }
                // CRIANDO O REGISTRO MÉDICO NA BLOCKCHAIN
                    // CREATE ASSET 
                    const txCreateMedicalRecord = driver.Transaction.makeCreateTransaction(
                        // ASSET DATA
                        attObj,
                        // ASSET METADATA
                        {
                            'Medico': attObj.Medico.Nome,
                            'CRM': attObj.Medico.CRM,
                            'Create_medical_record_date': new Date()
                        },
                        // OUTPUT -> DESTINO(S) DO ASSET
                        [ driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(attObj.Medico.PublicKey), '1') ],
                        // INPUT -> QUEM CRIOU O ASSET
                        attObj.Medico.PublicKey
                )

                const txCreateMedicalRecordSigned =  driver.Transaction.signTransaction(txCreateMedicalRecord, attObj.Medico.PrivateKey)

                // ENVIANDO O CREATE PARA O BIGCHAINDB
                conn.postTransaction(txCreateMedicalRecordSigned)
                .then((retrievedTx) => {
                    console.log('Criação do Registro Médico na Blockchain com sucesso :', retrievedTx.id)

                    const txTransferMedicalRecord = driver.Transaction.makeTransferTransaction(
                            [{ tx: txCreateMedicalRecordSigned, output_index: 0 }],
                            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(attObj.Paciente.PublicKey))],
                            {'Paciente': attObj.Paciente.Nome}
                    )

                    // ASSINATURA DO VENDEDOR PARA TRANSAÇÃO
                    let txTransferMedicalRecordSigned = driver.Transaction.signTransaction(txTransferMedicalRecord, attObj.Medico.PrivateKey)

                    // POST COM UM COMMIT, ENTÃO A TRANSAÇÃO É VALIDADE E INSERIDA EM UM BLOCO
                    conn.postTransaction(txTransferMedicalRecordSigned)
                    // NUMERO DE OUTPUTS JÁ TRANSFERIDOS DO FORNECEDOR
                    .then(async ()=>{
                        // MENSAGEM DE SUCESSO NO CONSOLE
                        console.log('Transferência do Registro Médico para Paciente realizada com sucesso: ' + txTransferMedicalRecordSigned.id)

                        if(attObj.Atendimento.Hospital.Internacao){
                            Bed.update(
                                {
                                    bed_medical_record: txTransferMedicalRecordSigned.asset.id,
                                    bed_status: 1   // LEITO OCUPADO
                                },
                                {where: {bed_id: attObj.Atendimento.Hospital.Internacao.Leito_id}}
                            )
                        }
                        
                        // REDIRECIONANDO PARA VISUALIZAÇÃO DO REGISTRO MÉDICO APÓS AS TRANSAÇÕES DE ITENS USADOS
                        res.render('step4', { title: 'Atendimento Presencial', hospital: hospital, att: attObj})
                    }).catch((err)=>{console.log(err); throw err})
                }).catch((err)=>{console.log(err); throw err})
            }
            
            if(type_of_page == '')
                return res.render('index', { title: 'Atendimento Presencial'})
        }else{
            var erro ='Ocorreu um erro: Não foram recebidos dados do Atendimento.';
            return res.render('erro-page', { title: 'Erro', erro: erro} );
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

    // PASSANDO OS DADOS JSON PARA A VARIÁVEL GLOBAL
    attObj = req.body;

    try{
        return res.render('index', { title: 'Atendimento Presencial'})
    }catch(err){
        console.log(err);
        var erro ='Ocorreu um erro: ' +  err.message;
        return res.render('erro-page', { title: 'Erro', erro: erro} );
    }

};


/*

                                    // REDIRECIONANDO APÓS A TRANSAÇÃO
                                    // IDENTIFICANDO O HOSPITAL NO BANCO RELACIONAL
                                    const add = await Address.findOne({ 
                                        include: [{
                                            model: Hospital,
                                            where: { add_id: hos.add_id },
                                            required: true
                                        }], 
                                        raw: true 
                                    });
                                    const hospital = { hos, add }

*/

/*

                            if(AssetCheckTestCovid.data.Product.Description.toUpperCase().includes("COVID")){
                                var result = Math.random() >= 0.5;
                                var result_test = '';
                                if(result)
                                    result_test = 'POSITIVO'
                                else
                                    result_test = 'NEGATIVO'
                                metadata = {
                                        'COVID_result_test': result_test,
                                        'Transaction_date': new Date()
                                }
                            }else{
                                metadata = {
                                        'Transaction_date': new Date()
                                }
                            }
*/