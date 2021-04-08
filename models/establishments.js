const mongoose = require("mongoose")

const EstablishmentsSchema = new mongoose.Schema({
    establishmentId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    establishmentName: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model("Establishments", EstablishmentsSchema)
