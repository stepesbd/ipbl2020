'use strict';

exports.post = (req, res, next) => {

};

exports.get = (req, res, next) => {
    res.render('index', { title: 'Bem Vindo!' })
};