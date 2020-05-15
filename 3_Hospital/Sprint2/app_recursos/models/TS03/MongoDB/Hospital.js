const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const HospitalSchema = new Schema({
    hos_cnpj: {
        type: String,
        //unique: true,
        minlength: [18, 'CNPJ com menos dígitos do que o necessário.'],
        maxlength: [18, 'CNPJ com mais dígitos do que o necessário.'],
        required: [true, 'Necessário informar o CNPJ.']
    },
    hos_cnes_code: {
        type: String,
        required: [true, 'Necessário informar o CNES.']
    },
    hos_name: {
        type: String,
        required: [true, 'Necessário informar o nome do hospital.']
    },
    hos_corporate_name: {
        type: String,
        required: [true, 'Necessário informar a Razão Social.']
    },
    // CHAVES PARA BLOCKCHAIN
    hos_keypair: {
        publicKey: { type: String },
        privateKey: { type: String }
    }
})


const Hospital = mongoose.model("Hospital", HospitalSchema);

module.exports = Hospital;