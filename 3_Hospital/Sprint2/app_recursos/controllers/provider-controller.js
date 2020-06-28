'use strict';
const driver = require('bigchaindb-driver')
const got = require('got');
const BigchainDB = require( '../config/dbBigchainDB' );
const BigchainDB_API_PATH = 'http://' + BigchainDB.IP + ':9984/api/v1/'
const { Provider } = require('../models/TS03');

exports.get = async (req, res, next) => {

    try{
            const pro = await Provider.findOne({ where: {pro_id: req.params.user_id}, raw: true });

            if(req.params.page == 'estoque'){
                // BUSCANDO CONEXÃO COM MONGODB DA BLOCKCHAIN
                const bigchain = BigchainDB.getDb();
                // ESTABELECENDO CONEXÃO COM API DA BIGCHAINDB
                const conn = new driver.Connection(BigchainDB_API_PATH)
                // BUSCAR TODOS OS ASSETS DO HOSPITAL
                const providerAssets = [];
                if(pro.pro_publicKey){
                    const userAllTransfers = await conn.listOutputs(pro.pro_publicKey, false)
                    
                    await Promise.all(userAllTransfers.map(async oneTransfer => {
                        const transaction_id = oneTransfer.transaction_id
                        const transaction = await bigchain.collection('transactions').findOne({ id: transaction_id });
                        const quantidade = transaction.outputs[0].amount
                        if(transaction.operation == 'CREATE'){
                            var asset_id = transaction.id
                        }else if(transaction.operation == 'TRANSFER'){
                            var asset_id = transaction.asset.id
                        }
                        
                        const asset = await bigchain.collection('assets').findOne({ id: asset_id });
                        const asset_info = { asset, quantidade }
                        providerAssets.push(asset_info);
                    }));
                }

                return res.render('Estoque', { title: 'Estoque Fornecedor' , pro: pro, mat: providerAssets})
            }

            if(req.params.page == 'venda'){
                return res.render('Venda', { title: 'Vender Material', pro: pro  })
            }



            res.render('index', { title: 'Recursos', pro: pro  })
            
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
            const Pro = await Provider.findOne({ where: {pro_id: req.params.user_id}, raw: true });
                // GERANDO CHAVES PARA O FORNECEDOR CASO NÃO TENHA AINDA
                if(Pro.pro_privateKey == null || Pro.pro_privateKey== ""){
                    console.log("GERANDO NOVAS CHAVES..............")
                    const keys = new driver.Ed25519Keypair();
                    // ASSOCIANDO PAR DE CHAVES PARA FORNECEDOR
                    Pro.pro_publicKey = keys.publicKey,
                    Pro.pro_privateKey = keys.privateKey
                    Provider.update(
                        {
                            pro_publicKey: keys.publicKey,
                            pro_privateKey: keys.privateKey
                        },
                        {where: {pro_id: req.params.user_id}}
                    )
                    
                }

                var rand = Math.floor(Math.random() * 1000000).toString();

                // QUANTIDADE A CRIAR
                const quantidadeAssets = req.body.inputQty.toString();

                // CREATE ASSET 
                const provider_info = {name: Pro.pro_name, id: Pro.pro_id}
                var unitPrice = req.body.inputPrice
                unitPrice = unitPrice.split('.').join("");
                unitPrice = unitPrice.replace(/,/g, ".")
                unitPrice = parseFloat(unitPrice)
                const txCreateProAsset = driver.Transaction.makeCreateTransaction(
                        // ASSET DATA
                        {
                            'Product':{
                                'Type': req.body.inputType,
                                'Description': req.body.inputDesc,
                                'Part_number': rand, 
                                'Manufacturer': req.body.inputFabric,
                                
                            }
                        },
                        // ASSET METADATA
                        
                        {
                            'Provider': provider_info,
                            'Unit_price': unitPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
                            'Create_date': new Date()
                        },
                        // OUTPUT -> DESTINO(S) DO ASSET
                        [ driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(Pro.pro_publicKey), quantidadeAssets) ],
                        // INPUT -> QUEM CRIOU O ASSET
                        Pro.pro_publicKey
                )

                const txCreateAsset =  driver.Transaction.signTransaction(txCreateProAsset, Pro.pro_privateKey)

                const conn = new driver.Connection(BigchainDB_API_PATH)

                // ENVIANDO O CREATE PARA O BIGCHAINDB
                conn.postTransaction(txCreateAsset)
                .then((retrievedTx) => {
                    console.log('Transação de criação do Asset', retrievedTx.id, 'feita com sucesso.')
                    req.flash("success_msg", "Inclusão do material no estoque realizada com sucesso.")
                    res.redirect("/fornecedor/" + Pro.pro_id + "/estoque") 
                }).catch((err)=>{
                    console.log(err);
                    req.flash("error_msg", "Erro ao carregar a página.");
                    return res.redirect('/0');
                });
            
           
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao carregar a página.");
        return res.redirect('/0');
    }
};
