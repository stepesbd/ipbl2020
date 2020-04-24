//bibliotecas principais
const express = require('express');
const app = express(); //cria e configura a aplicacao
var handlebars = require("express-handlebars")



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
      }
  }
});

const bodyParser = require('body-parser')

//Outras bibliotecas
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//configuracoes gerais
  // view engine setup
  app.engine("handlebars", hbs.engine)
  app.set('view engine', 'handlebars');

  // body Parser
  app.use(bodyParser.urlencoded({extended: false})) //para codificar as urls
  app.use(bodyParser.json()) //todo conteudo deve convertido para json


//configuracao de Rotas
app.use('/', require('./routes/index-route')(app));
app.use('/hospital', require('./routes/hospital-route')(app));
app.use('/hospital/:hosp_id/employee', require('./routes/employee-route')(app));
app.use('/procedures', require('./routes/procedures-route')(app));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



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

module.exports = app;