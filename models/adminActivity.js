const mongoose = require("mongoose")

const AdminActivityLogSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    dateTime: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model("AdminActivityLog", AdminActivityLogSchema)
