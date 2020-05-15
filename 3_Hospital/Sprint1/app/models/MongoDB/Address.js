const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    add_street: {
        type: String,
        required: [true, 'Necessário informar a Rua do endereço.']
    },
    add_number: {
        type: Number,
        required: [true, 'Necessário informar o Número do endereço.']
    },
    add_city: {
        type: String,
        required: [true, 'Necessário informar a Cidade do endereço.']
    },
    add_state: {
        type: String,
        required: [true, 'Necessário informar o Estado do endereço.']
    },
    add_country: {
        type: String,
        required: [true, 'Necessário informar o País do endereço.']
    },
    add_zip_code: {
        type: String,
        required: [true, 'Necessário informar o Código Postal do endereço.']
    },
    // RELACIONAMENTOS
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
    }
})


const Address = mongoose.model("Address", AddressSchema);

module.exports = Address;