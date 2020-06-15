'use strict';
const sequelize = require('sequelize');
const { Address } = require('../models');
const { Bed } = require('../models');
const { Hospital } = require('../models');
const { Bed_sector} =  require('../models');

//#region  API 
exports.get = async (req, res, next) => {

    try{
        if(req.params.hosp_list){
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
            return res.json({
                'TIME_SCRUM': '03 - Hospital',
                'Paginas': ['https://stepesbdhospital.herokuapp.com/',
                            'https://stepesbdrecursos.herokuapp.com/',
                            'https://stepesbdmedrecords.herokuapp.com/',],
                'API': {
                    'Casos_positivos_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/positive',
                    'Numero_de_casos_positivos_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/positive/amount',
                    'Casos_recuperados_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/release',
                    'Numero_de_casos_recuperados_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/release/amount',
                    'Casos_obitos_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/death',
                    'Numero_de_casos_obitos_COVID-19': 'https://stepesbdmedrecords.herokuapp.com/api/death/amount',
                    'Lista_de_hospitais': 'https://stepesbdhospital.herokuapp.com/api/hosp-list',
                    'Geracao_de_chaves_blockchain': 'https://stepesbdmedrecords.herokuapp.com/api/keypair',
                    'Comunicacao_de_obitos': ' https://stepesbd.ddns.net:5000/patient/api',
                    'Contagem_de_obitos': 'https://stepesbd.ddns.net:5000/dashboard/api/obitos/covid',
                    'Simulacao_de_atendimento': 'https://stepesbd.ddns.net:5000/simulation/api/attendance'
                },
                'Versao': '1.0'
            })
        }
    }catch(err){
        var erro = err.message;
        console.log(err)
        res.render('erro-page', { title: 'Erro', erro: erro} );
    }
    
};
//#endregion