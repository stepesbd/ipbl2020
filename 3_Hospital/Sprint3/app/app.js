// MÓDULOS PRINCIPAIS
    var express = require('express');
    const handlebars = require("express-handlebars") 
    const bodyParser = require('body-parser')
    const app = express(); //cria e configura a aplicacao
    const path = require('path');
    const flash = require('connect-flash')
    const BigchainDB = require( './config/dbBigchainDB' );

// CONEXÃO COM BANCO DE DADOS BLOCKCHAIN
BigchainDB.connectToServer( function( err, client ) {
  if (err) console.log(err);

    // CONFIGURAÇÕES
        // BODY-PARSER
            app.use(bodyParser.urlencoded({extended: false})) //para codificar as urls
            app.use(bodyParser.json()) //todo conteudo deve convertido para json
        // HANDLEBARS
            var hbs = handlebars.create({
                defaultLayout: "main",
                // Specify helpers which are only registered on this instance.
                helpers: {
                    select: function(value, options) {
                        return options.fn(this)
                        .split('\n')
                        .map(function(v) {
                            var t = 'value="' + value + '"'
                            return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
                        })
                        .join('\n')
                    },
                    ifEquals: function(arg1, arg2, options){
                        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                    },
                    ifNotEquals: function(arg1, arg2, options){
                        return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
                    },
                    ifSubstring: function(arg1, arg2, options){
                        return (arg1.includes(arg2.toString().toUpperCase())) ? options.fn(this) : options.inverse(this);
                    },
                    json: function (content) {
                        return JSON.stringify(content);
                    },
                }
            });
            app.engine("handlebars", hbs.engine)
            app.set('view engine', 'handlebars');
        // PUBLIC
            app.use(express.static(path.join(__dirname, 'public')));

    // OUTRAS BIBLIOTECAS
        var createError = require('http-errors');
        var cookieParser = require('cookie-parser');
        var logger = require('morgan');

    // OBJETO QUE ARMAZENARÁ O JSON VINDO DA VIEW DE ATENDIMENTO INICIAL
        attObj = {};   // VARIÁVEL GLOBAL
    
    // ROTAS
        app.use('/', require('./routes/route')(app));
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());

    // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            next(createError(404));
        });

    // error handler
        app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            err.stack = (err.stack || '');
            res.locals.reason = err.stack.match(/(?<=Validation error: )[^,\n\r]+/gmi);
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });

} );

module.exports = app;