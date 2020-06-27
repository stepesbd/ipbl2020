'use strict';
var request = require('request');
const HOST = require('../config/hostAPP').HOST;
const atendimentoData = require('../public/json/atendimento.json')
const atendimentoSemPaciente = require('../public/json/atendimento-sem-paciente.json')

exports.get = async (req, res, next) => {

    try{

        if(req.params.type == 'api'){
            request({
                url: HOST,
                method: "POST",
            }, function (error, response, body){
                res.redirect(HOST);
            });
        }

        if(req.params.type == 'mock'){
            request({
                url: HOST,
                method: "POST",
                json: true,   // <--Very important!!!
                //body: myJSONObject
                body: atendimentoData
            }, function (error, response, body){
                res.redirect(HOST);
            });
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

            
           
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao carregar a página.");
        return res.redirect('/0');
    }
};
