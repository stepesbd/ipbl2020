const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    emp_cns_code: {
        type: String,
        required: [true, 'Necessário informar o código CNES.']
    },
    emp_name: {
        type: String,
        required: [true, 'Necessário informar o nome do Funcionário.']
    },
    emp_occupation: {
        type: String,
        required: [true, 'Necessário informar o cargo do Funcionário.']
    },
    // RELACIONAMENTOS
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        require: true
    },
    contact: [{
        type: Schema.Types.ObjectId,
        ref: 'Contact',
        require: true
    }],
    hosp_emp: [{
        type: Schema.Types.ObjectId,
        ref: 'Hosp_emp',
    }],
})


const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;