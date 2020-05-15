const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Hosp_empSchema = new Schema({
    hos_emp_salary: {
        type: String,
        required: [true, 'Necessário informar o salário do Funcionário.']
    },
    hos_emp_admission_date: {
        type: Date,
        required: [true, 'Necessário informar a data de admissão do Funcionário.']
    },
    hos_emp_demission_date: {
        type: Date,
        default: null
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


const Hosp_emp = mongoose.model("Hosp_emp", Hosp_empSchema);

module.exports = Hosp_emp;