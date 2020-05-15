const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Hosp_med_procSchema = new Schema({
    hosp_med_proc_value: {
        type: String,
        required: [true, 'Necessário informar o valor do Procedimento.']
    },
    // RELACIONAMENTOS
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
    },
    medical_procedure: {
        type: Schema.Types.ObjectId,
        ref: 'Medical_procedure',
    }
})


const Hosp_med_proc = mongoose.model("Hosp_med_proc", Hosp_med_procSchema);

module.exports = Hosp_med_proc;