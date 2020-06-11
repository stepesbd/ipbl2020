'use strict';

exports.get = async (req, res, next) => {

    try{
        return res.render('index', { title: 'Bem Vindo!' })
    }catch(err){
        var erro = err.message;
        console.log(err)
        res.render('erro-page', { title: 'Erro', erro: erro} );
    }
    
};
