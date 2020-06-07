'use strict';
var request = require('request');

exports.get = async (req, res, next) => {

    try{
            
        var myJSONString = '{"Medico": {"Nome": "Dr. Fulano de Tal","CRM": "5146196","PrivateKey": "2aMh4yfiuJvKS5QrAqm6kLZzQYWZeWxQXgpLaqALtbez","PublicKey": "3VFpHzbEpsK8NP78gS9AsXjNwecXAFoBgyGLBLcRBfQG"},"Paciente": {"Nome": "Ciclano de Tal","PrivateKey": "FgHiBw18sKDui8NyyBNqcvDrcyUbwwJDTfJQhhUSdgX","PublicKey": "vQxxTQ5nniK1yeDQt6PwwRDAmgifFXz9vara8M8PCSG","Endereco": {"Rua": "Av. ABC","Numero": 123,"Bairro": "DEF","Cidade": "São José dos Campos","UF": "SP","CEP": "12228-610"}},"Atendimento": {"Sintomas": ["Tosse","Pigarro","Diarréia"],"Estado": "Grave","Comentarios": "Aqui o médico faz os demais comentários que ele acha pertinente da consulta para que fique registrado...  Ex.: Medicamentos que deve tomar, deve ou não internar, etc..."}}';
        var myJSONObject = JSON.parse(myJSONString);

        //console.log(myJSONObject)
        
        request({
            url: "http://localhost:2000/",
            method: "POST",
            json: true,   // <--Very important!!!
            body: myJSONObject
        }, function (error, response, body){
            //console.log(response);
            res.redirect('http://localhost:2000');
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
