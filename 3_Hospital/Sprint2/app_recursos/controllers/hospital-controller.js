'use strict';
const driver = require('bigchaindb-driver');
const got = require('got');
const moment = require('moment');
moment.locale('pt-BR');
const BigchainDB = require( '../config/dbBigchainDB' );
const BigchainDB_API_PATH = 'http://35.247.236.106:9984/api/v1/'
const { Hospital } = require('../models/TS03');
const { Provider } = require('../models/TS03');
const { Order } = require('../models/TS03');
const { Ord_seller_consumer } = require('../models/TS03');

exports.get = async (req, res, next) => {

    try{
        // IDENTIFICANDO O HOSPITAL QUE ENTROU NA VIEW RECURSOS
        const hos = await Hospital.findOne({ where: {hos_cnes_code: req.params.user_id}, raw: true });    

        // BUSCANDO CONEXÃO COM MONGODB DA BLOCKCHAIN
        const bigchain = BigchainDB.getDb();

        // ESTABELECENDO CONEXÃO COM API DA BIGCHAINDB
        const conn = new driver.Connection(BigchainDB_API_PATH)

        var teste = ''
        // CASO ACESSADO PÁGINA DE ESTOQUE
        if(req.params.page == 'estoque'){
            // LISTA DE ARRAYS PARA ARMAZENAR INFORMAÇÕES PASSADAS PARA FRONT-END
            const userAssets = [];
            const assetHistory = [];
            const assetsIDRepeat = []
            // REALIZA CONSULTAS APENAS SE O HOSPITAL JÁ TIVER FEITO PELO MENOS UMA COMPRA
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
                    var quantidade = 0;
                    // ENCONTRAR TODAS AS TRANSACTIONS ENVOLVENDO O ASSET
                    await conn.listTransactions(asset_id).then(async allTranscactions =>{ 
                        // EXECUTAR OS PASSOS ABAIXO PARA CADA TRANSACTION DESTE ASSET
                        await Promise.all(allTranscactions.map(async transaction => {
                            // ENCONTRANDO O VENDEDOR
                            const pro = await Provider.findOne({where: { pro_publicKey: transaction.inputs[0].owners_before[0] }})
                            // TIPO DA TRANSACTION: CREATE OU TRANSFER
                            const operation = transaction.operation
                            // CASO TRANSACTION CRIATE, BLOCO GÊNESIS
                            if(operation == 'CREATE'){
                                var consumer = pro.pro_name
                                var seller = ' --- '
                                var date = moment(transaction.metadata.Create_date).format('L')
                                var unit_price = transaction.metadata.Unit_price
                                // PREENCHIMENTO DE ITENS DO HISTÓRICO DESTE ASSET
                                var historyFields = { asset_id, seller, consumer, operation, date, unit_price}
                                // EMPILHA O HISTÓRICO
                                assetHistory.push(historyFields)
                            }else{
                                // CASO SEJA UMA TRANSACTION TRANSFER, VERIFICAR SE O HOSPITAL É UM DOS COMPRADORES DA TRANSACTION
                                await Promise.all(transaction.outputs.map(async output => {
                                    if(output.public_keys == hos.hos_publicKey){
                                        var date = moment(transaction.metadata.Transaction_date).format('L')
                                        var unit_price = transaction.metadata.Unit_price
                                        var total_price = transaction.metadata.Total_price
                                        var quantity =  transaction.metadata.Quantity_purchased
                                        quantidade = quantidade + parseInt(quantity, 10)
                                        var consumer = hos.hos_name
                                        var seller = pro.pro_name
                                        // PREENCHIMENTO DE ITENS DO HISTÓRICO DESTE ASSET
                                        var historyFields = { asset_id, seller, consumer, operation, date, unit_price, quantity, total_price}
                                        // EMPILHA O HISTÓRICO
                                        assetHistory.push(historyFields)
                                    }
                                }));
                            }
                        }));
                    }).catch(err=>{console.log(err)});
                    // CONCATENANDO AS INFORMAÇÕES DO ASSET EM UM OBJETO
                    const asset_info = { asset_id, asset, quantidade, assetHistory }
                    // EMPILHANDO O HISTÓRICO
                    userAssets.push(asset_info);
                }));
            }
            res.render('Estoque', { title: 'Estoque Hospital' , hos: hos, assets: userAssets})
        }else if(req.params.page == 'compra'){
        // CASO ACESSADO PÁGINA DE COMPRA
        
            // ENCONTRANDO TODOS OS FORNECEDORES NO BANCO DE DADOS
            const someProviders = await Provider.findAll();
            
            // BUSCAR TODOS OS ASSETS DOS FORNECEDORES E CONCENTRAR EM UM ÚNICO ARRAY
            const providerAssets = []
            await Promise.all(someProviders.map(async pro => {
                // CASO O FORNECEDOR DA VEZ TENHA CHAVE JÁ CADASTRADA, FAZ A BUSCA DE ITENS À VENDA
                if(pro.pro_privateKey){
                    // LISTAR TODOS OS UNSPENT-ASSETS DESTE FORNECEDOR
                    const proAllTransfers = await conn.listOutputs(pro.pro_publicKey, false)
                    // MAPEAR TODAS OS UNSPENT-ASSETS
                    await Promise.all(proAllTransfers.map(async oneTransfer => {
                        const transaction_id = oneTransfer.transaction_id
                        const transaction = await conn.getTransaction(transaction_id)

                        // MAPERAR TODOS OS OUTPUTS DESTA TRANSFER (JÁ FORNECEDOR JÁ VENDEU PARCIAL)
                        await Promise.all(transaction.outputs.map(async output => {
                            // IDENTIFICA O FORNECEDOR ATRAVÉS DA CHAVE PÚBLICA NO OUTPUT
                            const pro = await Provider.findOne({where: { pro_publicKey: output.public_keys[0] }})
                            // CASO O ASSET SEJA DE UM FORNECEDOR, ESTÁ À VENDA
                            if(pro){
                                // DE ACORDO COM O TIPO DE UNSPENT-TRANSFER (CREATE/TRANSFER), PREENCHER O ARRAY DE ASSETS
                                const provider = transaction.metadata.Provider
                                const unit_price = transaction.metadata.Unit_price
                                if(transaction.operation == 'CREATE'){
                                    const asset = transaction.asset.data
                                    const quantidade = output.amount
                                    const asset_info = { provider, unit_price, asset, quantidade, transaction_id }
                                    providerAssets.push(asset_info);
                                }else if(transaction.operation == 'TRANSFER'){
                                    const assetFullString = await got('http://35.247.236.106:9984/api/v1/assets/?search=' + transaction.asset.id);
                                    const assetFullObj = JSON.parse(assetFullString.body);
                                    const asset = assetFullObj[0].data
                                    const quantidade = output.amount
                                    const asset_info = { provider, unit_price, asset, quantidade, transaction_id }
                                    providerAssets.push(asset_info);
                                }
                            }
                        }));
                    })).catch(err=>{
                        console.log(err)
                    });
                }
            })).catch(err=>{
                console.log(err)
            })
            
            res.render('Compra', { title: 'Compra de Material', hos: hos, item: providerAssets })
        }else{
            res.render('index', { title: 'Recursos' , hos: hos})
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
        var type_of_purchase = req.params.type.toUpperCase()
        if(type_of_purchase == 'DIRECT'){
            // ENCONTRANDO O FORNECEDOR VENDEDOR E COLETANDO SUAS INFORMAÇÕES
            const pro = await Provider.findOne({ where: {pro_id: req.body.inputProviderID}, raw: true }); req.body.inputProviderID 
            const pro_info = {name: pro.pro_name, id: pro.pro_id}
            // ENCONTRANDO O HOSPITAL COMPRADOR
            const Hos = await Hospital.findOne({ where: {hos_cnes_code: req.params.user_id}, raw: true });
            // GERANDO CHAVES PARA O HOSPITAL CASO NÃO TENHA AINDA
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

            // IDENTIFICANDO AS CHAVES DE ASSINATURA DO COMPRADOR E VENDEDOR
            const consumer_publicKey = Hos.hos_publicKey
            const consumer_privateKey = Hos.hos_privateKey
            const seller_publicKey = pro.pro_publicKey
            const seller_privateKey = pro.pro_privateKey

            // INICIANDO CONEXÃO COM API BIGCHAINDB
            const conn = new driver.Connection(BigchainDB_API_PATH)
            // ENCONTRANDO O ASSET QUE VAI COMPRAR NA BLOCKCHAIN
            const txPurchaseAsset = await conn.getTransaction(req.body.inputTransactionID)
            
            // VERIFICANDO O PREÇO UNITÁRIO PARA O ITEM A SER COMPRADO
            var unit_price = txPurchaseAsset.metadata.Unit_price

            // CALCULANDO O VALOR TOTAL DA COMPRA
            var totalPrice = unit_price
            totalPrice = totalPrice.split('R').join("");
            totalPrice = totalPrice.split('$').join("");
            totalPrice = totalPrice.split(' ').join("");
            totalPrice = totalPrice.split(',').join("");
            totalPrice = parseFloat(totalPrice)  * parseInt(req.body.inputQty)
            totalPrice = totalPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

            // DESCOBRINDO A QUANTIDADE E O INDEX DO OUTPUT NA UNPENT-TRANSACTION DO ITEM À VENDA
            var remainQuantity = '';
            var outputIndex = 0;
            if(txPurchaseAsset.operation == 'CREATE'){
                remainQuantity = parseInt(txPurchaseAsset.outputs[0].amount) - parseInt(req.body.inputQty)
            }else if(txPurchaseAsset.operation == 'TRANSFER'){
                outputIndex = 1
                await Promise.all(txPurchaseAsset.outputs.map(async output => {
                    if(output.public_keys[0] == pro.pro_publicKey){
                        remainQuantity = parseInt(output.amount) - parseInt(req.body.inputQty)
                    }
                }))
            }

           
            // DEFININDO OS OUTPUTS DA TRRANSAÇÃO A PARTIR DA QUANTIDADE COMPRADA
            var outputs = []
            if(remainQuantity == 0){
                // CASO COMPRE TODO O ESTOQUE DO VENDEDOR
                outputs = [ driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(consumer_publicKey), req.body.inputQty)]
            }else if(remainQuantity > 0){
                // CASO COMPRE ESTOQUE PARCIAL DO VENDEDOR
                outputs = [ driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(consumer_publicKey), req.body.inputQty),
                            driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(seller_publicKey), remainQuantity.toString()) ]
            }else{
                req.flash("error_msg", "Não é possível comprar um número acima do estoque.");
                return res.redirect("/hospital/" + Hos.hos_cnes_code + "/compra")
            }

            // TRANSFERÊNCIA DO ASSET
            const txTransferAsset = await driver.Transaction.makeTransferTransaction(
                // INPUT -> ORIGEM DO ASSET
                [ { tx: txPurchaseAsset, output_index: outputIndex } ],
                // OUTPUT -> DESTINO(S) DO ASSET
                outputs,
                // TRANSFER METADATA
                {
                    'Provider': pro_info,
                    'Unit_price': unit_price,
                    'Quantity_purchased': req.body.inputQty,
                    'Total_price': totalPrice,
                    'Transaction_date': new Date()
                }
            )

            // ASSINATURA DO VENDEDOR PARA TRANSAÇÃO
            let txTransferAssetSigned = driver.Transaction.signTransaction(txTransferAsset, seller_privateKey)

            // POST COM UM COMMIT, ENTÃO A TRANSAÇÃO É VALIDADE E INSERIDA EM UM BLOCO
            conn.postTransaction(txTransferAssetSigned)
            // NUMERO DE OUTPUTS JÁ TRANSFERIDOS DO FORNECEDOR
            .then(()=>{
                req.flash("success_msg", "Aquisição de material realizada com sucesso.")
                res.redirect("/hospital/" + Hos.hos_cnes_code + "/estoque") 
            }).catch((err)=>{console.log(err); throw err})
        }

        if(type_of_purchase == 'ORDER'){
            
            
            Order.create({
                ord_asset_id : req.body.inputTransactionID,
                ord_quantity: req.body.inputQty,
                ord_date : new Date(),
                }).then( (ord) => {
                    Provider.findOne({ where: {pro_id: req.body.inputProviderID}, raw: true }).then((pro)=>{
                        // ENCONTRANDO O HOSPITAL COMPRADOR
                        Hospital.findOne({ where: {hos_cnes_code: req.params.user_id}, raw: true }).then((Hos)=>{

                            ord.addHospital(Hos.hos_id, {
                                through: { 
                                    osc_seller_id: pro.pro_id,
                                } 
                            })

                            req.flash("success_msg", "Pedido feito com sucesso. Aguarde confirmação do fornecedor.")
                            res.redirect("/hospital/" + Hos.hos_cnes_code + "/estoque") 
                        }).catch((err)=>{
                            console.log(err);
                            req.flash("error_msg", "Erro ao realizar pedido.");
                            return res.redirect('/0');
                        });
                    });
                    
                    // ENCONTRANDO O FORNECEDOR VENDEDOR E COLETANDO SUAS INFORMAÇÕES
                    
                    
                    
                }).catch((err)=>{
                    console.log(err);
                    req.flash("error_msg", "Erro ao realizar pedido.");
                    return res.redirect('/0');
                })

        }
           
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao carregar a página.");
        return res.redirect('/0');
    }
};