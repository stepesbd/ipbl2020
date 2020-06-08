'use strict';
const sequelize = require('sequelize');
const { Address } = require('../models');
const { Bed } = require('../models');
const { Hospital } = require('../models');
const { Bed_sector} =  require('../models');

//#region  Index ou API para listar hospitais
exports.get = async (req, res, next) => {

    try{
        // CASO HAJA REQUISIÇÃO DA API
        if(req.params.api == 'hosp-list'){
            Bed.belongsTo(Bed_sector,   {foreignKey: 'sector_id'});

            // PEGA TODOS OS HOSPITAIS COM ENDEREÇO
            const objects = await Address.findAll({
                attributes: ["add_id", "add_street", "add_number", "add_city", "add_state", "add_country", "add_zip_code", "add_latitude", "add_longitude",], 
                raw: true,
                include:[{
                    model: Hospital,
                    attributes: ["hos_id", "hos_name", "hos_corporate_name"],   
                    required: true,
                    raw: true,
                }],
            })
            
            // ARRAY QUE CONTERÁ A LISTA FINAL A SER ENVIADA
            const arrayHosp = [];

            // PROMISSE PARA MAPEAR TODOS OS HOSPITAIS
            await Promise.all(objects.map(async obj => {
                // PARA CADA HOSPITAL, CONTAR OS LEITOS VAGOS DE AMBULATÓRIOS
                const qty = await Bed.findOne({  
                    attributes: [[sequelize.fn('COUNT', sequelize.col('bed_id')), 'vacancy']],
                    raw: true,              
                    include: [{
                        model: Bed_sector,
                        where: { id: 2 },       // APENAS LEITOS DE AMBULATÓRIOS
                        attributes: [],
                        required: true,                                             
                    }],
                    where: {hos_id: obj['Hospitals.hos_id']}
                })

                // ACRESCENTA INFORMAÇÃO DE QUANTIDADE NO OBJETO
                obj = { ...obj, qty_vacancy:  qty.vacancy }

                // EDIÇÃO DE NOMES DOS CAMPOS JSON
                var ObjSTR = JSON.stringify(obj)
                var re = /Hospitals./gi;
                ObjSTR = ObjSTR.replace(re, '');
                const objMod = JSON.parse(ObjSTR)
                // EMPILHA NO ARRAY FINAL
                arrayHosp.push(objMod)
            }))
            // ENVIA COMO RESPONSE
            return res.json(arrayHosp)
        }else{
            // CASO NÃO HAJA REQUISIÇÃO DA API, APENAS CARREGA INDEX
            return res.render('index', { title: 'Bem Vindo!' })
        }
    }catch(err){
        var erro = err.message;
        console.log(err)
        res.render('erro-page', { title: 'Erro', erro: erro} );
    }
    
};
//#endregion





/*
const obj = await Address.findAll({
                attributes: ["add_id", "add_street", "add_number", "add_city", "add_state", "add_country", "add_zip_code", "add_latitude", "add_longitude",], 
                raw: true,
                include:[{
                    model: Hospital,
                    attributes: ["hos_id", "hos_name", "hos_corporate_name"],   
                    required: true,
                    raw: true,
                    include: [{
                        model: Bed,
                        attributes: ["bed_id"], 
                        required: true,
                        raw: true,
                        include: [{
                            model: Bed_sector,
                            attributes: ["sector_desc"],
                            where: { id: 2 }    // LISTAR APENAS AMBULATÓRIOS
                        }]
                    }],
                }],
            });

            var ObjSTR = JSON.stringify(obj)
            var re = /Hospitals./gi;
            ObjSTR = ObjSTR.replace(re, '');
            re = /Beds./gi;
            ObjSTR = ObjSTR.replace(re, '');
            re = /Bed_sector./gi;
            ObjSTR = ObjSTR.replace(re, '');
            const objMod = JSON.parse(ObjSTR)

*/