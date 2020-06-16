'use strict';
var request = require('request');
const HOST = require('../config/hostAPP').HOST;
const atendimentoData = require('../public/json/atendimento.json')
const atendimentoSemPaciente = require('../public/json/atendimento-sem-paciente.json')

exports.get = async (req, res, next) => {

    try{

        var ceps = [
            '"Rua": "Rua Francisco Rafael","Numero": 95,"Bairro": "DEF","Cidade": "São José dos Campos","UF": "SP","CEP": "12210-060"',
            '"Rua": "Av. Rui Barbosa","Numero": 123,"Bairro": "Jardim Bela Vista","Cidade": "São José dos Campos","UF": "SP","CEP": "12209-000"',
            '"Rua": "Av. Guanabara","Numero": 55,"Bairro": "Centro","Cidade": "São José dos Campos","UF": "SP","CEP": "12209-010"',
            '"Rua": "Rua J","Numero": 123,"Vila Santa Helena": "DEF","Cidade": "São José dos Campos","UF": "SP","CEP": "12209-070"',
            '"Rua": "Rua K","Numero": 123,"Bairro": "Vila Mascarenhas","Cidade": "São José dos Campos","UF": "SP","CEP": "12209-150"',
            '"Rua": "Av. Cícero","Numero": 123,"Bairro": "Jardim Bela Vista","Cidade": "São José dos Campos","UF": "SP","CEP": "12209-020"',
            '"Rua": "Rua H9A","Numero": 101,"Bairro": "CTA","Cidade": "São José dos Campos","UF": "SP","CEP": "12228-610"',
            '"Rua": "Av. GGG","Numero": 55,"Bairro": "Vila Maria","Cidade": "São José dos Campos","UF": "SP","CEP": "12209-230"',
            '"Rua": "Av. ABC","Numero": 123,"Bairro": "DEF","Cidade": "São José dos Campos","UF": "SP","CEP": "12210-060"',
        ]

        var nomes = [
            '"Algusto José"',
            '"Francisco de Paula"',
            '"Benedito da Silva"',
            '"Bernando Campos"',
            '"Juan Dantas"',
            '"Marcelo Albuquerque"',
            '"Maria Joaquina"',
            '"Etelvina Alves"',
            '"Joana Darc"',
        ]
        

        //let randomCEP = ceps[Math.floor(Math.random() * ceps.length)];
        //let randomNomes = nomes[Math.floor(Math.random() * nomes.length)];
        //    
        //var myJSONString = '{"Medico": {"Nome": "Dr. Fulano de Tal","CRM": "5146196","PrivateKey": "2aMh4yfiuJvKS5QrAqm6kLZzQYWZeWxQXgpLaqALtbez","PublicKey": "3VFpHzbEpsK8NP78gS9AsXjNwecXAFoBgyGLBLcRBfQG"},"Paciente": {"Id": "1","Nome": ' + randomNomes + ',"PrivateKey": "FgHiBw18sKDui8NyyBNqcvDrcyUbwwJDTfJQhhUSdgX","PublicKey": "vQxxTQ5nniK1yeDQt6PwwRDAmgifFXz9vara8M8PCSG","Endereco": {' + randomCEP + '}},"Atendimento": {"Sintomas": ["Tosse","Pigarro","Diarréia"],"Estado": "Grave","Comentarios": "Aqui o médico faz os demais comentários que ele acha pertinente da consulta para que fique registrado...  Ex.: Medicamentos que deve tomar, deve ou não internar, etc..."}}';
        //var myJSONObject = JSON.parse(myJSONString);

        request({
            url: HOST,
            method: "POST",
            json: true,   // <--Very important!!!
            //body: myJSONObject
            body: atendimentoData
        }, function (error, response, body){
            res.redirect(HOST);
        });

        
            
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
