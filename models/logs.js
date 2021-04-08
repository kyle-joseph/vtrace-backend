const mongoose = require("mongoose")

const LogsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    establishmentId: {
        type: String,
        required: true,
    },
    dateTime: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model("Log", LogsSchema)
