const mongoose = require("mongoose")

const EstablishmentsSchema = new mongoose.Schema(
    {
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
        street: {
            type: String,
        },
        barangay: {
            type: String,
            required: true,
        },
        cityMun: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Establishments", EstablishmentsSchema)
