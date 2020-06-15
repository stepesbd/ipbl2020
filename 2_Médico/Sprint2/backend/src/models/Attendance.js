const mongoose = require('mongoose')

const AttendanceSchema = new mongoose.Schema({
    operation: {
        type: String,
        required: true
    },
    ack_queue: {
        type: String,
        required: true
    },
    physicianId: {
        type: Number,
        required: true
    },
    symptoms: [{
        type: String,
    }],
    diagnosis: {
        type: String
    },
    newAttendance: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        default: true
    }
})

module.exports = mongoose.model('atendimentos', AttendanceSchema)