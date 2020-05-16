'use strict';
const driver = require('bigchaindb-driver')
const BigchainDB = require( '../config/dbBigchainDB' );
const BigchainDB_API_PATH = 'http://35.247.236.106:9984/api/v1/'
const { Hospital } = require('../models/TS03');

exports.get = async (req, res, next) => {

    try{
        const hos = await Hospital.findOne({ where: {hos_cnes_code: req.params.user_id}, raw: true });
        /*************************** HOSPITAL *********************************/
        if(req.params.user == 'hospital'){
            

            if(req.params.page == 'estoque'){
                // BUSCANDO CONEXÃO COM MONGODB DA BLOCKCHAIN
                const bigchain = BigchainDB.getDb();
                // ESTABELECENDO CONEXÃO COM API DA BIGCHAINDB
                const conn = new driver.Connection(BigchainDB_API_PATH)
                // BUSCAR TODOS OS ASSETS DO HOSPITAL
                const userAssets = [];
                if(hos.hos_publicKey){
                    const userAllTransfers = await conn.listOutputs(hos.hos_publicKey, false)

                    await Promise.all(userAllTransfers.map(async oneTransfer => {
                        const transaction_id = oneTransfer.transaction_id
                        const transaction = await bigchain.collection('transactions').findOne({ id: transaction_id });
                        const quantidade = transaction.outputs[0].amount
                        const asset_id = transaction.asset.id
                        const asset = await bigchain.collection('assets').findOne({ id: asset_id });
                        const asset_info = { asset, quantidade }
                        userAssets.push(asset_info);
                    }));
                }

                res.render('Estoque', { title: 'Estoque Hospital' , hos: hos, mat: userAssets})

            }else if(req.params.page == 'aquisicao'){

                res.render('Aquisicao', { title: 'Seleção de Fornecedor', hos: hos })

            }else{

                res.render('index', { title: 'Recursos' , hos: hos})

            }
            
        }else{
            /*************************** FORNECEDORRES *********************************/
            res.render('index', { title: 'Recursos' })
        }
            
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao carregar a página.");
        return res.redirect('/');
    }

};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
    MÉTODO POST
*/

exports.post = async (req, res, next) => {
    try{    
        /*************************** HOSPITAL *********************************/
        if(req.params.user == 'hospital'){
            const Hos = await Hospital.findOne({ where: {hos_cnes_code: req.params.user_id}, raw: true });
            // GERANDO CHAVES PARA O HOSPITAL CASO NÃO TENHA AINDA
            if(Hos.hos_privateKey == null){
                // ASSOCIANDO PAR DE CHAVES PARA HOSPITAL
                if(Hos.hos_privateKey == null){
                    const keys = new driver.Ed25519Keypair();
                    // ASSOCIANDO PAR DE CHAVES PARA HOSPITAL
                    Hos.hos_publicKey = keys.publicKey,
                    Hos.hos_privateKey = keys.privateKey
                    Hospital.update(
                        {
                            hos_publicKey: keys.publicKey,
                            hos_privateKey: keys.privateKey
                        },
                        {where: {hos_cnes_code: req.params.user_id}}
                    )
                    
                }
            }


            // CRIANDO O PAR DE CHAVES PARA FORNECEDOR FICTÍCIO
            const Fornecedor = new driver.Ed25519Keypair()

            var rand = Math.floor(Math.random() * 1000000).toString();

            // QUANTIDADE A CRIAR
            const quantidadeAssets = req.body.inputQty;

            // CREATE ASSET 
            const txCreateFornecedorSimple = driver.Transaction.makeCreateTransaction(
                    // ASSET DATA
                    {
                        'Product':{
                            'Type': req.body.inputType,
                            'Description': req.body.inputProduct,
                            'Part_number': rand, 
                            'Manufacturer': 'ROCHE LABS',
                        }
                    },
                    // ASSET METADATA
                    {
                        'Provider': req.body.inputProvider,
                        'Representant': 'Fulano de Tal',
                        'Transaction_date': new Date()
                    },
                    // OUTPUT -> DESTINO(S) DO ASSET
                    [ driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(Fornecedor.publicKey), quantidadeAssets) ],
                    // INPUT -> QUEM CRIOU O ASSET
                    Fornecedor.publicKey
            )

            const txCreateAsset =  driver.Transaction.signTransaction(txCreateFornecedorSimple, Fornecedor.privateKey)

            const conn = new driver.Connection(BigchainDB_API_PATH)

            // ENVIANDO O CREATE PARA O BIGCHAINDB
            conn.postTransaction(txCreateAsset)
            .then((retrievedTx) => {
                console.log('Transação', retrievedTx.id, 'feita com sucesso.')
                     
            })
            .then( async () => {
                // TRANSFER ASSET
                const txTransferAsset = await driver.Transaction.makeTransferTransaction(
                        // INPUT -> ORIGEM DO ASSET
                        [ { tx: txCreateAsset, output_index: 0 } ],
                        // OUTPUT -> DESTINO(S) DO ASSET
                        [ driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(Hos.hos_publicKey), quantidadeAssets) ],
                        // TRANSFER METADATA
                        {
                            'Provider': req.body.inputProvider,
                            'Representant': 'Fulano de Tal',
                            'Transaction_date': new Date()
                        }
                )

                let txTransferAssetSigned = await driver.Transaction.signTransaction(txTransferAsset, Fornecedor.privateKey)

                // POST COM UM COMMIT, ENTÃO A TRANSAÇÃO É VALIDADE E INSERIDA EM UM BLOCO
                conn.postTransaction(txTransferAssetSigned)
                // NUMERO DE OUTPUTS JÁ TRANSFERIDOS DO FORNECEDOR
                .then(()=>conn.listOutputs(Fornecedor.publicKey, true))
                .then(listSpentOutputs => {  console.log("TRANSFERENCIAS JÁ FEITAS PELO(A): " + req.body.inputProvider, listSpentOutputs.length)
                    // NUMERO DE OUTPUTS AINDA NAO TRANSFERIDOS DO HOSPITAL
                    return conn.listOutputs(Hos.hos_publicKey, false)
                }).then(listUnspentOutputs => {  
                    console.log("TRANSFERENCIAS AINDA SOB A POSSE DO(A): " + Hos.hos_name, listUnspentOutputs.length)
                    req.flash("success_msg", "Aquisição de material realizada com sucesso.")
                    res.redirect("/Hospital/" + Hos.hos_cnes_code + "/Estoque") 
                }).catch((err)=>{console.log(err); throw err})

            }).catch((err)=>{
                console.log(err);
                req.flash("error_msg", "Erro ao carregar a página.");
                return res.redirect('/0');
            })                
        
        }else{
        /*************************** FORNECEDORRES *********************************/
            
        }
           
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao carregar a página.");
        return res.redirect('/0');
    }
};

