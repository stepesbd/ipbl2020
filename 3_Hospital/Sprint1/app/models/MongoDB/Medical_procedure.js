const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Medical_procedureSchema = new Schema({
    med_proc_cbhpm_code: {
        type: String,
        required: [true, 'Necessário informar o código CBHPM do Procedimento.']
    },
    med_proc_desc: {
        type: String,
        required: [true, 'Necessário informar a descrição do Procedimento.']
    },
    med_proc_uco: {
        type: String,
        required: [true, 'Necessário informar a descrição do Procedimento.']
    },
    // RELACIONAMENTOS
    hosp_med_proc: [{
        type: Schema.Types.ObjectId,
        ref: 'Hosp_med_proc',
    }]
})


const Medical_procedure = mongoose.model("Medical_procedure", Medical_procedureSchema);

module.exports = Medical_procedure;