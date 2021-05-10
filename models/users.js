const mongoose = require("mongoose")

const UsersSchema = new mongoose.Schema(
    {
        userId: {
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
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        birthdate: {
            type: String,
            required: true,
        },
        gender: {
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

module.exports = mongoose.model("Users", UsersSchema)
