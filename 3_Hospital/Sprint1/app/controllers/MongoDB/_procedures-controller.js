'use strict';
const mongoose = require("mongoose")
require("../../models/MongoDB/Hospital")
const Hospital = mongoose.model("Hospital")
require("../../models/MongoDB/Medical_procedure")
const Medical_procedure = mongoose.model("Medical_procedure")
require("../../models/MongoDB/Hosp_med_proc")
const Hosp_med_proc = mongoose.model("Hosp_med_proc")
const validation = require('../validation');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.get = async (req, res, next) => {

    try{
        // NÃO RECEBE PARÂMETRO DE IDENTIFICAÇÃO DO PROCEDIMENTO: RENDERIZA PÁGINA INICIAL DE LISTA DE PROCEDIMENTOS
        if(!req.params.proc_id){
            Medical_procedure.find((err, med_proc)=>{
                if(err){
                    console.log(err);
                    req.flash("error_msg", "Houve um erro ao listar os Procedimentos Médicos.");
                    return res.redirect('/');
                }
                res.render('_procedimentos-lista', { title: 'Lista de Procedimentos', med_proc: med_proc })
            });

        }else{
            // SE RECEBE PARÂMETRO, RENDERIZA PÁGINA DE ATUALIZAÇÃO DO PROCEDIMENTO
            const med_proc = await Medical_procedure.findById(req.params.proc_id);
            const hosp_med_proc = await Hosp_med_proc.find({ medical_procedure: med_proc._id }).populate("hospital");
            var count = 0;
            hosp_med_proc.forEach(()=>{
                count = count + 1;
            })
            res.render('_procedimentos-atualizacao', { title: 'Procedimento', med_proc: med_proc, hosp_med_proc: hosp_med_proc, count: count})
        }
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao carregar a página.");
        return res.redirect('/');
    }
    
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.post = async (req, res, next) => {
    
    try{
        // VALIDAÇÃO DOS DADOS ENVIADOS PELO FORMULÁRIO
        var erros = validation.validMedical_procedure(req.body);

        // VERIFICA CBHPM JÁ CADASTRADO
        const med_procCheckCBHPM = await Medical_procedure.findOne({ med_proc_cbhpm_code: req.body.inputCBHPM });
        if(med_procCheckCBHPM)
            erros.push({texto: "CBHPM já cadastrado."})

        if(erros.length > 0){
            res.render("_procedimentos-cadastro", {title: "Cadastro de Procedimentos" , erros: erros, values: req.body})
        }else{
            
            // CRIANDO MEDICAL_PROCEDURE
            Medical_procedure.create({
                med_proc_cbhpm_code: req.body.inputCBHPM,
                med_proc_desc: req.body.inputDesc.toUpperCase(),
                med_proc_uco: req.body.inputUCO,
            });

            req.flash("success_msg", "Procedimento Médico cadastrado com sucesso.")
            res.redirect('/MongoDB/procedures')
            
        }
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao tentar cadastrar o Procedimento Médico");
        return res.redirect('/MongoDB/procedures');
    }

};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.new = async (req, res, next) => {

    try{
        res.render('_procedimentos-cadastro', { title: 'Cadastro de Procedimento'})
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao carregar a página de Cadastro de Procedimentos.");
        return res.redirect('/MongoDB/procedures/');
    }
    
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.update =  async (req, res) => {

    try{
        const med_proc = await Medical_procedure.findById(req.params.proc_id);

        // VALIDAÇÃO DOS DADOS ENVIADOS PELO FORMULÁRIO
        var erros = validation.validMedical_procedure(req.body);

        // VERIFICA CBHPM JÁ CADASTRADO
        const med_procCheckCBHPM = await Medical_procedure.findOne({ med_proc_cbhpm_code: req.body.inputCBHPM });
        if(med_procCheckCBHPM && !med_procCheckCBHPM.equals(med_proc))
            erros.push({texto: "CBHPM já cadastrado."})

        if(erros.length > 0){
            const med_proc = await Medical_procedure.findById(req.params.proc_id);
            const hosp_med_proc = await Hosp_med_proc.find({ medical_procedure: med_proc._id }).populate("hospital");
            var count = 0;
            hosp_med_proc.forEach(()=>{
                count = count + 1;
            })
            res.render('_procedimentos-atualizacao', { title: 'Procedimento',  erros: erros, med_proc: med_proc, hosp_med_proc: hosp_med_proc, count: count})
        }else{
            
            // ATUALIZANDO MEDICAL_PROCEDURE
            await Medical_procedure.findByIdAndUpdate(req.params.proc_id, {
                med_proc_cbhpm_code: req.body.inputCBHPM,
                med_proc_desc: req.body.inputDesc.toUpperCase(),
                med_proc_uco: req.body.inputUCO,
            }, {new: true});

            req.flash("success_msg", "Procedimento Médico atualizado com sucesso.")
            res.redirect('/MongoDB/procedures')
            
        }
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao tentar atualizar o Procedimentos Médico.");
        return res.redirect('/MongoDB/procedures/');
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


exports.delete = async (req, res, next) => {

    try{
        // ENCONTRA O MEDICAL_PROCEDURE
        const med_procDel = await Medical_procedure.findOneAndRemove({ _id: req.params.proc_id });

        // ENCONTRA OS HOSPITAIS QUE POSSUEM RELAÇÃO COM O MEDICAL_PROCEDURE
        const hosp_med_procs = await Hosp_med_proc.find({ medical_procedure: med_procDel._id }).populate("hospital");

        await Promise.all(hosp_med_procs.map(async (h_m_p)=>{
            await Hospital.findOne({ hosp_med_proc: h_m_p._id }, async (err, hos)=>{
                if(err){throw err};
                hos.hosp_med_proc.pop(h_m_p);
                await hos.save();
            })
        }));

        // ENCONTRA AS RELAÇÕES HOSP_MED_PROC ASSOCIADOS AO MEDICAL_PROCEDURE-OBJETO E DELETA
        await Hosp_med_proc.deleteMany({ medical_procedure: med_procDel._id });

        req.flash("success_msg", "Procedimento Médico apagado com sucesso.");
        res.redirect('/MongoDB/procedures');
    }catch(err){
        console.log(err);
        req.flash("error_msg", "Erro ao tentar apagar o Procedimento Médico");
        return res.redirect('/MongoDB/procedures');
    }

}
