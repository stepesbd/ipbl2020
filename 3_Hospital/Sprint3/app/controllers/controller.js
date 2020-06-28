'use strict';
var request = require('request');
var requestAsync = require('async-request');
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
const { RecordsCovidHome } = require('../models/TS03');
const date_base = require('../config/dbBigchainDB').date_base;

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
                return res.render('erro-page', { title: 'Erro', erro: 'Esta página foi desabilitada para uso de integração completa.'} );

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
                // TESTE DE ENVIO DOS DADOS
                //        attObj.Atendimento = { ...attObj.Atendimento,  
                //            // ADICIONANDO LEITO DE INTERNAÇÃO NO JSON ATENDIMENTO (ESCOLHA DO STEP 2)
                //        // Data_atendimento: moment(new Date()).format('L'),
                //        Data_atendimento: moment(new Date()).subtract(date_base, 'days').format('L'),
                //        Hospital: {
                //            Id: 488, 
                //            } 
                //        }

                // CHECANDO OS DADOS DE CHEGADA NO ATTOBJ
                if(attObj.Atendimento.Hospital != undefined){
                    if(attObj.Atendimento.Hospital.Id){
                        // IDENTIFICANDO O HOSPITAL NO BANCO RELACIONAL
                        const hos = await Hospital.findByPk(attObj.Atendimento.Hospital.Id);
                        // ADICIONANDO NOME DO HOSPITAL NO ATENDIMENTO
                        attObj.Atendimento.Hospital = { ...attObj.Atendimento.Hospital,  
                            Nome: hos.hos_name, 
                        }
                        console.log(attObj)
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
                    }else   
                        return res.render('erro-page', { title: 'Erro', erro: 'Não foi recebido o ID do Hospital. Verifique os dados de envio do Atendimento.'} );
                }else   
                    return res.render('erro-page', { title: 'Erro', erro: 'Não foi recebido o Hospital. Verifique os dados de envio do Atendimento.'} );
                
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
                var result_test = '';
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
                                    //var result = Math.random() >= 0.1;
                                    var result = true;
                                    // CASO TESTE POSITIVO
                                    if(result){
                                        result_test = 'POSITIVO';
                                        // ACRESCENTANDO INFORMAÇÃO DE EXAME NO ATENDIMENTO PARA CASOS POSITIVOS DE COVID
                                        attObj.Atendimento.Hospital = { ...attObj.Atendimento.Hospital, 
                                            Exame_covid: {
                                                Paciente: attObj.Paciente.Id, 
                                                Resultado: result_test,
                                                Latitude: attObj.Paciente.Endereco.Latitude.toString(),
                                                Longitude: attObj.Paciente.Endereco.Longitude.toString(),
                                                // Data: moment(new Date()).format('L'),
                                                // Unix_time: parseInt((new Date().getTime() / 1000).toFixed(0))
                                                Data: moment(new Date()).subtract(date_base, 'days').format('L'),
                                                Unix_time: parseInt((new Date().getTime() / 1000).toFixed(0)) - (86400 * date_base)
                                            }
                                        }
                                        metadata = {
                                            'COVID-19': {
                                                'Test': result_test,
                                                'Status': 'POSITIVO'
                                            },
                                            //'Transaction_date': new Date(),
                                            'Transaction_date': moment(new Date()).subtract(date_base, 'days').format('L'),
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
                                            //'Transaction_date': new Date(),
                                            'Transaction_date': moment(new Date()).subtract(date_base, 'days').format('L'),
                                        }
                                    }
                                }else{
                                    // ADICIONANDO METADATA PARA TRANSACTION CREATE DO ATENDIMENTO SEM USO DE TESTE DE COVID
                                    metadata = {
                                            //'Transaction_date': new Date(),
                                            'Transaction_date': moment(new Date()).subtract(date_base, 'days').format('L'),
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
                            //'Create_medical_record_date': new Date()
                            'Create_medical_record_date': moment(new Date()).subtract(date_base, 'days').format('L')
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
                            {
                                'Paciente': attObj.Paciente.Id,
                                'Type': 'PRELIMINARY-CARE'
                            }
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
                        }else{
                            if(result_test == 'POSITIVO'){
                                // INSERINDO REGISTRO NA TABELA RELACIONAL DE CASOS DE COVID SEM INTERNAÇÃO
                                RecordsCovidHome.create({
                                    rec_paciente_id: attObj.Paciente.Id,
                                    rec_name: attObj.Paciente.Nome,
                                    rec_date: moment(new Date()).subtract(date_base, 'days').format('L'),
                                    rec_cpf: attObj.Paciente.CPF,
                                    rec_medrec_id: txTransferMedicalRecordSigned.asset.id
                                });
                            }
                        }
                        
                        // REDIRECIONANDO PARA VISUALIZAÇÃO DO REGISTRO MÉDICO APÓS AS TRANSAÇÕES DE ITENS USADOS
                        return res.render('step4', { title: 'Atendimento Presencial', hospital: hospital, att: attObj, id: retrievedTx.id})
                    }).catch((err)=>{console.log(err); throw err})
                }).catch((err)=>{console.log(err); throw err})
            }
            
            if(type_of_page == ''){
                return res.render('index', { title: 'Atendimento Presencial'})
            }
                
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

    

    if(req.body.Atendimento){
        attObj = req.body
        return res.render('index', { title: 'Atendimento Presencial'})
    }else
         request({
            url: "http://stepesbd.ddns.net:5000/simulation/api/attendance",
            method: "GET",
        }, function (error, response, body){
            if(error)throw error; 
            try {
                attObj = JSON.parse(body)
                return res.render('index', { title: 'Atendimento Presencial'})
            } catch (error) {
                try {
                    if(error)throw error; 
                    request({
                        url: "http://stepesbd.ddns.net:5000/simulation/api/attendance",
                        method: "GET",
                    }, function (error, response, body){
                        if(error)throw error; 
                        attObj = JSON.parse(body)
                        return res.render('index', { title: 'Atendimento Presencial'})
                    });
                } catch (err) {
                    console.log(err);
                    var erro ='Ocorreu um erro: ' +  err.message;
                    return res.render('erro-page', { title: 'Erro', erro: erro} );
                }
            }
        });


};