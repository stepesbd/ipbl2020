var moment = require('moment');
var validator = require('validator');
const { cnpj } = require('cpf-cnpj-validator');

module.exports = {

    // VALIDAÇÕES PARA O HOSPITAL
    validHospital: function (body) {
      // ARRAY DE ERROS
      var erros = []
        // VALIDANDO CNPJ
        if(!body.inputCNPJ || typeof body.inputCNPJ == undefined || body.inputCNPJ == null){
            erros.push({texto: "CNPJ inválido. "})
        }else{
            // VERIFICA SE O NÚMERO RECEBIDO É UM CNPJ VÁLIDO
            var CNPJvalido = cnpj.isValid(body.inputCNPJ);
            if(!CNPJvalido)
                erros.push({texto: "CNPJ inválido, preencha de acordo com as regras específicas de CNPJ."})
        }

        // VALIDANDO CNES
        if(!body.inputCNES || typeof body.inputCNES == undefined || body.inputCNES == null){
            erros.push({texto: "CNES inválido. "})
        }else{
            var countErr = 0;
            var errosCNES = 'CNES inválido. ';
            if(!validator.isNumeric(body.inputCNES)){
                countErr++;
                errosCNES = errosCNES.concat('Use apenas números. ');
            }
            if(body.inputCNES.length != 7){
                countErr++;
                errosCNES = errosCNES.concat('Deve conter 7 dígitos. ');
            }
            if(countErr > 0)
                erros.push({texto: errosCNES})
        }

        // VALIDANDO NOME
        if(!body.inputNome || typeof body.inputNome == undefined || body.inputNome == null){
            erros.push({texto: "Nome inválido. "})
        }else{
            var countErr = 0;
            var errosNome = 'Nome inválido. ';
            if(body.inputNome.length < 5 || body.inputNome.length > 100){
                countErr++;
                errosNome = errosNome.concat('Deve conter entre 5 e 100 caracteres. ');
            }
            //if(!validator.isAlphanumeric(body.inputNome, ['pt-BR'])){
            //    countErr++;
            //    errosNome = errosNome.concat('Use apenas caracteres alfanuméricos. ');
            //}
            if(countErr > 0)
                erros.push({texto: errosNome})
        }

        // VALIDANDO RAZÃO SOCIAL
        if(!body.inputCorporate || typeof body.inputCorporate == undefined || body.inputCorporate == null){
            erros.push({texto: "Razão Social inválida. "})
        }else{
            var countErr = 0;
            var errosCorporate = 'Razão Social inválida. ';
            if(body.inputCorporate.length < 10 || body.inputCorporate.length > 100){
                countErr++;
                errosCorporate = errosCorporate.concat('Deve conter entre 10 e 100 caracteres. ');
            }
            //if(!validator.isAlphanumeric(body.inputCorporate, ['pt-BR'])){
            //    countErr++;
            //    errosCorporate = errosCorporate.concat('Use apenas caracteres alfanuméricos. ');
            //}
            if(countErr > 0)
                erros.push({texto: errosCorporate})
        }

        // VALIDANDO RUA
        if(!body.inputStreet || typeof body.inputStreet == undefined || body.inputStreet == null){
        erros.push({texto: "Rua inválida."})
        }else{
            var countErr = 0;
            var errosStreet = 'Rua inválida. ';
            if(body.inputStreet.length < 5 || body.inputStreet.length > 50){
                countErr++;
                errosStreet = errosStreet.concat('Deve conter entre 5 e 50 caracteres. ');
            }
            //if(!validator.isAlphanumeric(body.inputStreet, ['pt-BR'])){
            //    countErr++;
            //    errosStreet = errosStreet.concat('Use apenas caracteres alfanuméricos. ');
            //}
            if(countErr > 0)
                erros.push({texto: errosStreet})
        }

        // VALIDANDO NÚMERO
        if(!body.inputNumber || typeof body.inputNumber == undefined || body.inputNumber == null){
            erros.push({texto: "Número inválido."})
        }else{
            var countErr = 0;
            var errosNumber = 'Número inválido. ';
            if(!validator.isNumeric(body.inputNumber)){
                countErr++;
                errosNumber = errosNumber.concat('Use apenas números. ');
            }
            if(countErr > 0)
                erros.push({texto: errosNumber})
        }

        // VALIDANDO CIDADE
        if(!body.inputCity || typeof body.inputCity == undefined || body.inputCity == null){
            erros.push({texto: "Cidade inválida."})
        }else{
            var countErr = 0;
            var errosCity = 'Cidade inválida. ';
            if(body.inputCity.length < 1 || body.inputCity.length > 50){
                countErr++;
                errosCity = errosCity.concat('Deve conter entre 1 e 50 caracteres. ');
            }
            //if(!validator.isAlphanumeric(body.inputCity, ['pt-BR'])){
            //    countErr++;
            //    errosCity = errosCity.concat('Use apenas caracteres alfanuméricos. ');
            //}
            if(countErr > 0)
                erros.push({texto: errosCity})
        }

        // VALIDANDO ESTADO
        if(!body.inputState || typeof body.inputState == undefined || body.inputState == null){
            erros.push({texto: "Estado inválido."})
        }else{
            var countErr = 0;
            var errosState = 'Estado inválido. ';
            if(!validator.isAlpha(body.inputState, ['pt-BR'])){
                countErr++;
                errosState = errosState.concat('Use apenas letras. ');
            }
            if(body.inputState.length < 1 || body.inputState.length > 50){
                countErr++;
                errosState = errosState.concat('Deve conter entre 1 e 50 caracteres. ');
            }
            if(countErr > 0)
                erros.push({texto: errosState})
        }

        // VALIDANDO PAÍS
        if(!body.inputCountry || typeof body.inputCountry == undefined || body.inputCountry == null){
            erros.push({texto: "País inválido."})
        }else{
            var countErr = 0;
            var errosCountry = 'País inválido. ';
            if(!validator.isAlpha(body.inputCountry, ['pt-BR'])){
                countErr++;
                errosCountry = errosCountry.concat('Use apenas letras. ');
            }
            if(body.inputCountry.length < 1 || body.inputCountry.length > 50){
                countErr++;
                errosCountry = errosCountry.concat('Deve conter entre 1 e 50 caracteres. ');
            }
            if(countErr > 0)
                erros.push({texto: errosCountry})
        }

        // VALIDANDO CÓDIGO POSTAL
        if(!body.inputZipCode || typeof body.inputZipCode == undefined || body.inputZipCode == null){
            erros.push({texto: "Código Postal inválido."})
        }else{
            var countErr = 0;
            var errosZipCode = 'Código Postal inválido. ';
            //if(!validator.isNumeric(body.inputZipCode, [{no_symbols: false}])){
            //    countErr++;
            //    errosZipCode = errosZipCode.concat('Use apenas números. ');
            //}
            if(countErr > 0)
                erros.push({texto: errosZipCode})
        }

        // RETORNA ARRAY DE ERROS ACUMULADOS NA VALIDAÇÃO
        return erros;
    },

    // VALIDAÇÕES PARA FUNCIONÁRIO
    validEmployee: function(body){

        // ARRAY DE ERROS
        var erros = []

        // VALIDANDO CNS
        if(!body.inputCNS || typeof body.inputCNS == undefined || body.inputCNS == null){
            erros.push({texto: "CNS inválido."})
        }else{
            var countErr = 0;
            var errosCNS = 'CNS inválido. ';
            if(body.inputCNS.length != 15){
                countErr++;
                errosCNS = errosCNS.concat('Deve conter 15 dígitos. ');
            }
            if(!validator.isNumeric(body.inputCNS)){
                countErr++;
                errosCNS = errosCNS.concat('Use apenas números. ');
            }
            if(countErr > 0)
                erros.push({texto: errosCNS})
        }

        // VALIDANDO CARGO-FUNÇÃO
        if(!body.inputFuncao || typeof body.inputFuncao == undefined || body.inputFuncao == null){
            erros.push({texto: "Função atribuída inválida."})
        }else{
            var countErr = 0;
            var errosFuncao = 'Função atribuída inválida. ';
            if(body.inputFuncao.length < 1 || body.inputFuncao.length > 100){
                countErr++;
                errosFuncao = errosFuncao.concat('Deve conter entre 1 e 100 caracteres. ');
            }
            //if(!validator.isAlphanumeric(body.inputFuncao, ['pt-BR'])){
            //    countErr++;
            //    errosFuncao = errosFuncao.concat('Use apenas caracteres alfanuméricos. ');
            //}
            if(countErr > 0)
                erros.push({texto: errosFuncao})
        }

        // VALIDANDO NOME
        if(!body.inputNome || typeof body.inputNome == undefined || body.inputNome == null){
            erros.push({texto: "Nome inválido."})
        }else{
            var countErr = 0;
            var errosNome = 'Nome inválido. ';
            if(body.inputNome.length < 5 || body.inputNome.length > 100){
                countErr++;
                errosNome = errosNome.concat('Deve conter entre 5 e 100 caracteres. ');
            }
            //if(!validator.isAlphanumeric(body.inputNome, ['pt-BR'])){
            //    countErr++;
            //    errosNome = errosNome.concat('Use apenas caracteres alfanuméricos. ');
            //}
            if(countErr > 0)
                erros.push({texto: errosNome})
        }

        // VALIDANDO DATA DE ADMISSÃO
        if(!body.inputAdmi || typeof body.inputAdmi == undefined || body.inputAdmi == null){
            erros.push({texto: "Data de admissão inválida."})
        }else{
            var countErr = 0;
            var errosAdmi = 'Data de admissão inválida. ';
            if(moment(body.inputAdmi).isAfter(Date.now())){
                countErr++;
                errosAdmi = errosAdmi.concat('Não pode ser maior que a data atual. ');
            }
            if(moment(body.inputAdmi).isAfter(body.inputDemiss) && body.inputDemiss){
                countErr++;
                errosAdmi = errosAdmi.concat('Não pode ser maior que a data de demissão. ');
            }
            if(countErr > 0)
                erros.push({texto: errosAdmi})
        }

        // VALIDANDO DATA DE DEMISSÃO
        if( body.inputDemiss ){
            var countErr = 0;
            var errosDemiss = 'Data de demissão inválida. ';
            if( moment(body.inputDemiss).isAfter(Date.now()) ){
                countErr++;
                errosDemiss = errosDemiss.concat("Não pode ser maior que a data atual. ");
            }
            if( moment(body.inputDemiss).isBefore(body.inputAdmi) ){
                countErr++;
                errosDemiss = errosDemiss.concat("Não pode ser menor que a data de admissão. ");
            }
            if(countErr > 0)
                erros.push({texto: errosDemiss})
        }
        
        // VALIDANDO SALÁRIO
        if(!body.inputSalary || typeof body.inputSalary == undefined || body.inputSalary == null){
            erros.push({texto: "Salário inválido."})
        }else{
            var countErr = 0;
            var errosSalary = 'Salário inválido. ';
            var salary = onlyNumber(body.inputSalary);
            if(salary < 104500){
                countErr++;
                errosSalary = errosSalary.concat('Deve ser maior que um salário mínimo (R$ 1.045,00). ');
            }            
            if(countErr > 0)
                erros.push({texto: errosSalary})
        }

        // VALIDANDO RUA
        if(!body.inputStreet || typeof body.inputStreet == undefined || body.inputStreet == null){
            erros.push({texto: "Rua inválida."})
            }else{
                var countErr = 0;
                var errosStreet = 'Rua inválida. ';
                if(body.inputStreet.length < 5 || body.inputStreet.length > 50){
                    countErr++;
                    errosStreet = errosStreet.concat('Deve conter entre 5 e 50 caracteres. ');
                }
                //if(!validator.isAlphanumeric(body.inputStreet, ['pt-BR'])){
                //    countErr++;
                //    errosStreet = errosStreet.concat('Use apenas caracteres alfanuméricos. ');
                //}
                if(countErr > 0)
                    erros.push({texto: errosStreet})
            }
    
            // VALIDANDO NÚMERO
            if(!body.inputNumber || typeof body.inputNumber == undefined || body.inputNumber == null){
                erros.push({texto: "Número inválido."})
            }else{
                var countErr = 0;
                var errosNumber = 'Número inválido. ';
                if(!validator.isNumeric(body.inputNumber)){
                    countErr++;
                    errosNumber = errosNumber.concat('Use apenas números. ');
                }
                if(countErr > 0)
                    erros.push({texto: errosNumber})
            }
    
            // VALIDANDO CIDADE
            if(!body.inputCity || typeof body.inputCity == undefined || body.inputCity == null){
                erros.push({texto: "Cidade inválida."})
            }else{
                var countErr = 0;
                var errosCity = 'Cidade inválida. ';
                if(body.inputCity.length < 1 || body.inputCity.length > 50){
                    countErr++;
                    errosCity = errosCity.concat('Deve conter entre 1 e 50 caracteres. ');
                }
                //if(!validator.isAlphanumeric(body.inputCity, ['pt-BR'])){
                //    countErr++;
                //    errosCity = errosCity.concat('Use apenas caracteres alfanuméricos. ');
                //}
                if(countErr > 0)
                    erros.push({texto: errosCity})
            }
    
            // VALIDANDO ESTADO
            if(!body.inputState || typeof body.inputState == undefined || body.inputState == null){
                erros.push({texto: "Estado inválido."})
            }else{
                var countErr = 0;
                var errosState = 'Estado inválido. ';
                if(!validator.isAlpha(body.inputState, ['pt-BR'])){
                    countErr++;
                    errosState = errosState.concat('Use apenas letras. ');
                }
                if(body.inputState.length < 1 || body.inputState.length > 50){
                    countErr++;
                    errosState = errosState.concat('Deve conter entre 1 e 50 caracteres. ');
                }
                if(countErr > 0)
                    erros.push({texto: errosState})
            }
    
            // VALIDANDO PAÍS
            if(!body.inputCountry || typeof body.inputCountry == undefined || body.inputCountry == null){
                erros.push({texto: "País inválido."})
            }else{
                var countErr = 0;
                var errosCountry = 'País inválido. ';
                if(!validator.isAlpha(body.inputCountry, ['pt-BR'])){
                    countErr++;
                    errosCountry = errosCountry.concat('Use apenas letras. ');
                }
                if(body.inputCountry.length < 1 || body.inputCountry.length > 50){
                    countErr++;
                    errosCountry = errosCountry.concat('Deve conter entre 1 e 50 caracteres. ');
                }
                if(countErr > 0)
                    erros.push({texto: errosCountry})
            }
    
            // VALIDANDO CÓDIGO POSTAL
            if(!body.inputZipCode || typeof body.inputZipCode == undefined || body.inputZipCode == null){
                erros.push({texto: "Código Postal inválido."})
            }else{
                var countErr = 0;
                var errosZipCode = 'Código Postal inválido. ';
                //if(!validator.isNumeric(body.inputZipCode, [{no_symbols: false}])){
                //    countErr++;
                //    errosZipCode = errosZipCode.concat('Use apenas números. ');
                //}
                if(countErr > 0)
                    erros.push({texto: errosZipCode})
            }
    
            // RETORNA ARRAY DE ERROS ACUMULADOS NA VALIDAÇÃO
            return erros;
    },            
    
    // VALIDAÇÕES PARA PROCEDIMENTOS MÉDICOS
    validMedical_procedure: function(body){
        // ARRAY DE ERROS
        var erros = []

        // VALIDANDO CBHPM
        if(!body.inputCBHPM || typeof body.inputCBHPM == undefined || body.inputCBHPM == null){
            erros.push({texto: "CBHPM do Procedimento inválido."})
        }else{
            var countErr = 0;
            var errosCBHPM = 'CBHPM do Procedimento inválido. ';
            if(body.inputCBHPM.length != 12){
                countErr++;
                errosCBHPM = errosCBHPM.concat('Deve conter 12 dígitos. ');
            }
            if(countErr > 0)
                erros.push({texto: errosCBHPM})
        }

        // VALIDANDO DESCRIÇÃO DO PROCEDIMENTO
        if(!body.inputDesc || typeof body.inputDesc == undefined || body.inputDesc == null){
            erros.push({texto: "Descrição do Procedimento inválida."})
        }else{
            var countErr = 0;
            var errosDesc = 'Descrição do Procedimento inválido. ';
            if(body.inputDesc.length < 5 || body.inputDesc.length > 100){
                countErr++;
                errosDesc = errosDesc.concat('Deve conter entre 5 e 100 caracteres. ');
            }
            if(countErr > 0)
                erros.push({texto: errosDesc})
        }

        // VALIDANDO UCO
        if(!body.inputUCO || typeof body.inputUCO == undefined || body.inputUCO == null){
            erros.push({texto: "UCO do Procedimento inválido."})
        }

        // RETORNA ARRAY DE ERROS ACUMULADOS NA VALIDAÇÃO
        return erros;
    },

  };


function onlyNumber(str) {
    if (str){
        if (typeof str === "number") {
            str = str.toString()
            return parseInt(str.replace(/[^0-9]/g, ""))
        }
        return str.replace(/[^0-9]/g, "");
    }
}