const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    con_desc: {
        type: String,
        required: [true, 'Necessário informar o contato.']
    },
    con_type: {
        type: String,
        required: [true, 'Necessário informar o tipo do contato.']
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


const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;