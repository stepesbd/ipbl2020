'use strict';
//let request = require('async-request');
var request = require('request');
const fs = require("fs")


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
    MÉTODO GET
*/

exports.get = async (req, res, next) => {

    try{
        //const id = paciente_id.toString();
        const data_obito = parseInt((new Date().getTime() / 1000).toFixed(0)).toString();
        //const certidao_obito_id = txTransferReleaseSigned.id;
        console.log(data_obito)
        console.log(typeof data_obito)

        request({
            url: "http://stepesbd.ddns.net:5000/patient/api/kill",
            method: "PUT",
            json: true,   // <--Very important!!!
            body: {
                "id": "1",
                "causa_mortis": "COVID",
                "data_obito": data_obito,
                "certidao_obito_id": "NAMFOOF3028HI2HV"
            }
        }, function (error, response, body){
            return res.json(response)
        });
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

