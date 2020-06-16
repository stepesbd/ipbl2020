'use strict';
let request = require('async-request');
const driver = require('bigchaindb-driver');
const BigchainDB = require( '../config/dbBigchainDB' );
const BigchainDB_API_PATH = 'http://' + BigchainDB.IP + ':9984/api/v1/'
const fsPromise = require('fs').promises;
const fs = require("fs")


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
    MÉTODO GET
*/

exports.get = async (req, res, next) => {

    try{
        const bigchain = BigchainDB.getDb();
        var request = '';
        var action = '';
        if(req.params.request)
            request = req.params.request.toUpperCase();
        if(req.params.action)
            action = req.params.action.toUpperCase();
        if(request == 'POSITIVE'){
            const result = await bigchain.collection('assets').find( {'data.Atendimento.Hospital.Exame_covid.Resultado': 'POSITIVO'}).project({'data.Atendimento.Hospital.Exame_covid':true}).toArray()
            
            const qtyCases = result.length;

            return res.render('googleMap', { title: 'Mapa de Contágio', map: 'positive', cases: result, qtyCases:qtyCases })
        }else{
            return res.render('erro-page',  {    title: 'Erro', 
                                                        erro: '404',
                                                        msg:[{text: 'Página não encontrada.'},{text: 'Clique abaixo para ir à página de casos positivos de COVID-19.'}],
                                                        page: '/map/positive'
                                                    });
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

    }catch(err){
        console.log(err);
        var erro ='Ocorreu um erro: ' +  err.message;
        return res.render('erro-page', { title: 'Erro', erro: erro} );
    }

};

